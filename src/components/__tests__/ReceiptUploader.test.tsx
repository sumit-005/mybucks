import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReceiptUploader } from '../ReceiptUploader';
import { useOCR } from '@/hooks/useOCR';

// Mock the useOCR hook
vi.mock('@/hooks/useOCR', () => ({
  useOCR: vi.fn(),
}));

describe('ReceiptUploader', () => {
  const mockProcessImage = vi.fn();
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useOCR as any).mockReturnValue({
      processImage: mockProcessImage,
      reset: mockReset,
      isLoading: false,
      error: null,
      lineItems: null,
    });
  });

  it('renders the upload area', () => {
    render(<ReceiptUploader />);
    expect(screen.getByText(/Drag and drop a receipt image here/i)).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const file = new File(['test'], 'receipt.jpg', { type: 'image/jpeg' });
    render(<ReceiptUploader />);

    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockProcessImage).toHaveBeenCalledWith(file);
    });
  });

  it('shows loading state', () => {
    (useOCR as any).mockReturnValue({
      processImage: mockProcessImage,
      reset: mockReset,
      isLoading: true,
      error: null,
      lineItems: null,
    });

    render(<ReceiptUploader />);
    expect(screen.getByText(/Processing receipt/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    (useOCR as any).mockReturnValue({
      processImage: mockProcessImage,
      reset: mockReset,
      isLoading: false,
      error: 'Failed to process image',
      lineItems: null,
    });

    render(<ReceiptUploader />);
    expect(screen.getByText(/Failed to process image/i)).toBeInTheDocument();
  });

  it('shows extracted line items', () => {
    (useOCR as any).mockReturnValue({
      processImage: mockProcessImage,
      reset: mockReset,
      isLoading: false,
      error: null,
      lineItems: [
        { description: 'Item 1', price: 10.00 },
        { description: 'Item 2', quantity: 2, price: 5.00 },
      ],
    });

    render(<ReceiptUploader />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();
  });

  it('handles reset', async () => {
    render(<ReceiptUploader />);
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    expect(mockReset).toHaveBeenCalled();
  });
}); 