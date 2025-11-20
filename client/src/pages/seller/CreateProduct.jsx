import { useState } from 'react';
import { useForm } from 'react-hook-form';
import productService from '../../services/productService';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import ImageUploader from '../../components/forms/ImageUploader';

const CreateProduct = () => {
  const [images, setImages] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { condition: 'used' },
  });

  const onSubmit = async (values) => {
    try {
      await productService.create({
        ...values,
        tags: values.tags ? values.tags.split(',').map((tag) => tag.trim()) : [],
        images,
      });
      reset();
      setImages([]);
      alert('Product published!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">Create product</h1>
          <p className="text-sm text-gray-500">
            Upload images directly from your gallery and manage previews before
            publishing.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl border border-brand-light bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Title" {...register('title', { required: true })} />
          <Input label="Category" {...register('category')} />
          <Input
            label="Price (₹)"
            type="number"
            step="0.01"
            {...register('price', { required: true })}
          />
          <Input label="Location" {...register('location')} />
          <label className="flex flex-col gap-1 text-sm font-medium text-brand-dark">
            Condition
            <select
              className="rounded-lg border border-gray-200 px-3 py-2"
              {...register('condition')}
            >
              <option value="new">New</option>
              <option value="like-new">Like new</option>
              <option value="used">Used</option>
              <option value="heavily-used">Heavily used</option>
            </select>
          </label>
          <Input
            label="Tags (comma separated)"
            placeholder="tech, books"
            {...register('tags')}
          />
        </div>
        <Textarea
          label="Description"
          rows={5}
          {...register('description', { required: true })}
        />
        <ImageUploader value={images} onChange={setImages} />
        <Button disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish product'}
        </Button>
      </form>
    </section>
  );
};

export default CreateProduct;

