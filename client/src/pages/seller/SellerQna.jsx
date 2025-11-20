import { useCallback, useEffect, useState } from 'react';
import qnaService from '../../services/qnaService';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SellerQna = () => {
  const [threads, setThreads] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await qnaService.forSeller();
      setThreads(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submitAnswer = async (id) => {
    try {
      await qnaService.answer({ questionId: id, answer: answers[id] });
      setAnswers((prev) => ({ ...prev, [id]: '' }));
      load();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-dark">Q&A inbox</h1>
      <div className="space-y-4">
        {threads.map((thread) => (
          <div
            key={thread._id}
            className="space-y-3 rounded-2xl border border-brand-light bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">
                {thread.product?.title}
              </p>
              <p className="text-lg font-semibold">{thread.question}</p>
              <p className="text-sm text-gray-500">
                Asked by {thread.askedBy?.name}
              </p>
            </div>
            <div className="space-y-2">
              {thread.replies?.map((reply, idx) => (
                <div key={idx} className="rounded-xl bg-brand-light/60 p-3">
                  <p className="text-sm text-gray-500">
                    {reply.author?.name} replied
                  </p>
                  <p>{reply.message}</p>
                </div>
              ))}
            </div>
            <Textarea
              label="Your answer"
              value={answers[thread._id] || ''}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [thread._id]: e.target.value }))
              }
            />
            <Button onClick={() => submitAnswer(thread._id)}>Send answer</Button>
          </div>
        ))}
        {!threads.length && <p>No questions yet.</p>}
      </div>
    </section>
  );
};

export default SellerQna;

