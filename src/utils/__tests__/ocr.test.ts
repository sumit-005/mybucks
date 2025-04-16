import { describe, it, expect, vi } from 'vitest';
import { processReceipt, extractLineItems } from '../ocr';

// Mock Tesseract.js
vi.mock('tesseract.js', () => ({
  createWorker: vi.fn().mockResolvedValue({
    recognize: vi.fn().mockResolvedValue({
      data: {
        text: 'Sample receipt text\nItem 1 $10.00\nItem 2 2x $5.00\nTotal $20.00',
        confidence: 90,
        blocks: [
          {
            paragraphs: [
              {
                lines: [
                  {
                    text: 'Item 1 $10.00',
                    confidence: 90,
                    bbox: { x0: 0, y0: 0, x1: 100, y1: 20 },
                  },
                  {
                    text: 'Item 2 2x $5.00',
                    confidence: 90,
                    bbox: { x0: 0, y0: 20, x1: 100, y1: 40 },
                  },
                ],
              },
            ],
          },
        ],
      },
    }),
    terminate: vi.fn(),
  }),
}));

describe('OCR Utilities', () => {
  describe('processReceipt', () => {
    it('should process a receipt image and return OCR result', async () => {
      const mockFile = new File([''], 'receipt.jpg', { type: 'image/jpeg' });
      const result = await processReceipt(mockFile);

      expect(result).toEqual({
        text: 'Sample receipt text\nItem 1 $10.00\nItem 2 2x $5.00\nTotal $20.00',
        confidence: 90,
        items: [
          {
            text: 'Item 1 $10.00',
            confidence: 90,
            bbox: { x0: 0, y0: 0, x1: 100, y1: 20 },
          },
          {
            text: 'Item 2 2x $5.00',
            confidence: 90,
            bbox: { x0: 0, y0: 20, x1: 100, y1: 40 },
          },
        ],
      });
    });
  });

  describe('extractLineItems', () => {
    it('should extract line items from OCR result', () => {
      const ocrResult = {
        text: 'Sample receipt text\nItem 1 $10.00\nItem 2 2x $5.00\nTotal $20.00',
        confidence: 90,
        items: [
          {
            text: 'Item 1 $10.00',
            confidence: 90,
            bbox: { x0: 0, y0: 0, x1: 100, y1: 20 },
          },
          {
            text: 'Item 2 2x $5.00',
            confidence: 90,
            bbox: { x0: 0, y0: 20, x1: 100, y1: 40 },
          },
        ],
      };

      const lineItems = extractLineItems(ocrResult);

      expect(lineItems).toEqual([
        {
          description: 'Item 1',
          price: 10.00,
        },
        {
          description: 'Item 2',
          quantity: 2,
          price: 5.00,
        },
      ]);
    });

    it('should handle lines without prices or quantities', () => {
      const ocrResult = {
        text: 'Sample receipt text\nItem 1\nItem 2\nTotal $20.00',
        confidence: 90,
        items: [
          {
            text: 'Item 1',
            confidence: 90,
            bbox: { x0: 0, y0: 0, x1: 100, y1: 20 },
          },
          {
            text: 'Item 2',
            confidence: 90,
            bbox: { x0: 0, y0: 20, x1: 100, y1: 40 },
          },
        ],
      };

      const lineItems = extractLineItems(ocrResult);

      expect(lineItems).toEqual([
        {
          description: 'Item 1',
        },
        {
          description: 'Item 2',
        },
      ]);
    });
  });
}); 