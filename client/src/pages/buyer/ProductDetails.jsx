import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import qnaService from '../../services/qnaService';
import QnaThread from '../../components/qna/QnaThread';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import useSocket from '../../hooks/useSocket';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket, joinProductRoom, leaveProductRoom } = useSocket();
  const [product, setProduct] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const assetBase =
    import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const gallery = useMemo(
    () =>
      product?.images?.map((img) =>
        img.url?.startsWith('http') ? img.url : `${assetBase}${img.url}`,
      ) || [],
    [product, assetBase],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, qnaData] = await Promise.all([
          productService.getById(id),
          qnaService.forProduct(id),
        ]);
        setProduct(productData);
        setQuestions(qnaData);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;
    joinProductRoom(id);

    socket.on('question:new', (question) => {
      setQuestions((prev) => [question, ...prev]);
    });

    socket.on('question:answer', (answer) => {
      setQuestions((prev) =>
        prev.map((q) => (q._id === answer._id ? answer : q)),
      );
    });

    return () => {
      leaveProductRoom(id);
      socket.off('question:new');
      socket.off('question:answer');
    };
  }, [socket, id, joinProductRoom, leaveProductRoom]);

  const submitQuestion = async () => {
    if (!questionText.trim()) return;
    try {
      const created = await qnaService.ask({ productId: id, question: questionText });
      setQuestions((prev) => [created, ...prev]);
      setQuestionText('');
    } catch (error) {
      alert(error.message);
    }
  };

  const placeOrder = async () => {
    try {
      setPlacingOrder(true);
      await orderService.create({ productId: id, note });
      setNote('');
      alert('Order placed! Wait for seller approval.');
    } catch (error) {
      alert(error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading || !product) {
    return <LoadingSpinner />;
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          {gallery[0] && (
            <img
              src={gallery[0]}
              alt={product.title}
              className="rounded-3xl border border-brand-light object-cover"
            />
          )}
          <div className="grid grid-cols-4 gap-3">
            {gallery.slice(1).map((img) => (
              <img
                key={img}
                src={img}
                alt="Preview"
                className="h-24 rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-brand-light bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-brand-pink">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-brand-dark">{product.title}</h1>
          <p className="text-2xl font-bold text-brand-pink">
            ₹{Number(product.price).toLocaleString()}
          </p>
          <p className="text-brand-dark/80">{product.description}</p>
          <div className="rounded-2xl bg-brand-light/60 p-4">
            <p className="text-sm text-gray-500">Seller</p>
            <p className="text-lg font-semibold">{product.seller?.name}</p>
            <p className="text-sm text-gray-500">{product.seller?.email}</p>
          </div>
          {user && (
            <div className="space-y-3">
              <Textarea
                label="Order note for seller"
                placeholder="Add meetup preference or questions"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <Button className="w-full" onClick={placeOrder} disabled={placingOrder}>
                {placingOrder ? 'Submitting...' : 'Place order for approval'}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-3xl border border-brand-light bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-brand-dark">Q&A</h2>
          {user ? (
            <>
              <Textarea
                label="Ask the seller"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
              <Button onClick={submitQuestion}>Send question</Button>
            </>
          ) : (
            <p className="text-sm text-gray-500">Login to ask a question.</p>
          )}
        </div>
        <QnaThread questions={questions} />
      </div>
    </section>
  );
};

export default ProductDetails;

