import { useState, useRef } from 'react';
import { useOCR } from '@/hooks/useOCR';
import { Upload, Loader2, X } from 'lucide-react';

export function ReceiptUploader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { processImage, isLoading, error, lineItems, reset } = useOCR();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      await processImage(file);
    } catch (error) {
      console.error('Failed to process image:', error);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      await processImage(file);
    } catch (error) {
      console.error('Failed to process image:', error);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleReset = () => {
    reset();
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <p>Processing receipt...</p>
          </div>
        ) : previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="max-h-64 mx-auto"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-secondary-500" />
            <p>Drag and drop a receipt image here, or click to select</p>
            <p className="text-sm text-secondary-500">
              Supported formats: JPG, PNG, PDF
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {lineItems && (
        <div className="space-y-2">
          <h3 className="font-medium">Extracted Items:</h3>
          <div className="space-y-2">
            {lineItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-secondary-50 rounded-lg"
              >
                <span>{item.description}</span>
                <div className="flex gap-4">
                  {item.quantity && (
                    <span className="text-secondary-500">
                      Qty: {item.quantity}
                    </span>
                  )}
                  {item.price && (
                    <span className="font-medium">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 