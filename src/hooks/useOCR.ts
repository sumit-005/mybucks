import { useState } from 'react';
import { processReceipt, extractLineItems, type OCRResult } from '@/utils/ocr';

type OCRState = {
  isLoading: boolean;
  error: string | null;
  result: OCRResult | null;
  lineItems: Array<{
    description: string;
    quantity?: number;
    price?: number;
  }> | null;
};

export function useOCR() {
  const [state, setState] = useState<OCRState>({
    isLoading: false,
    error: null,
    result: null,
    lineItems: null,
  });

  const processImage = async (image: File | Blob) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await processReceipt(image);
      const lineItems = extractLineItems(result);
      
      setState({
        isLoading: false,
        error: null,
        result,
        lineItems,
      });
      
      return { result, lineItems };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  const reset = () => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      lineItems: null,
    });
  };

  return {
    ...state,
    processImage,
    reset,
  };
} 