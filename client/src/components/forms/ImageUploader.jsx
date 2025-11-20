import { useEffect, useState } from 'react';
import Button from '../ui/Button';

const ImageUploader = ({ value = [], onChange, max = 5 }) => {
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const next = value.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviews(next);

    return () => {
      next.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [value]);

  const handleFiles = (event) => {
    const files = Array.from(event.target.files).slice(0, max - value.length);
    if (!files.length) return;
    onChange([...value, ...files]);
  };

  const removeAt = (index) => {
    const next = value.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-pink/40 bg-white/60 px-6 py-10 text-center text-brand-pink hover:border-brand-pink">
        <span className="text-lg font-semibold">Upload images</span>
        <span className="text-sm text-brand-dark/60">
          Directly from your gallery or camera. Max {max} images.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        {previews.map((item, index) => (
          <div
            key={item.preview}
            className="relative rounded-xl border border-brand-light bg-white p-3"
          >
            <img
              src={item.preview}
              alt="Preview"
              className="h-40 w-full rounded-lg object-cover"
            />
            <div className="mt-2 flex items-center justify-between gap-2 text-xs">
              <Button
                type="button"
                variant="ghost"
                className="text-red-500"
                onClick={() => removeAt(index)}
              >
                Remove
              </Button>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => move(index, index - 1)}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => move(index, index + 1)}
                >
                  ↓
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;

