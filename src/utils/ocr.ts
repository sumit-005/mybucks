import { createWorker } from 'tesseract.js';

export type OCRResult = {
  text: string;
  confidence: number;
  items: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
};

export async function processReceipt(image: File | Blob): Promise<OCRResult> {
  const worker = await createWorker('eng');
  
  try {
    const { data } = await worker.recognize(image);
    
    // Process the OCR result to extract line items
    const items = data.blocks.flatMap(block =>
      block.paragraphs.flatMap(paragraph =>
        paragraph.lines.map(line => ({
          text: line.text.trim(),
          confidence: line.confidence,
          bbox: {
            x0: line.bbox.x0,
            y0: line.bbox.y0,
            x1: line.bbox.x1,
            y1: line.bbox.y1,
          },
        }))
      )
    );

    return {
      text: data.text,
      confidence: data.confidence,
      items,
    };
  } finally {
    await worker.terminate();
  }
}

export function extractLineItems(ocrResult: OCRResult): Array<{
  description: string;
  quantity?: number;
  price?: number;
}> {
  const lineItems: Array<{
    description: string;
    quantity?: number;
    price?: number;
  }> = [];

  // Regular expressions for matching common receipt patterns
  const pricePattern = /\d+\.\d{2}/;
  const quantityPattern = /(\d+)\s*x/;

  ocrResult.items.forEach(item => {
    const text = item.text;
    
    // Skip empty lines or lines that are likely headers/footers
    if (!text || text.length < 3) return;
    
    // Try to extract price
    const priceMatch = text.match(pricePattern);
    const price = priceMatch ? parseFloat(priceMatch[0]) : undefined;
    
    // Try to extract quantity
    const quantityMatch = text.match(quantityPattern);
    const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : undefined;
    
    // Extract description (remove price and quantity if present)
    let description = text
      .replace(pricePattern, '')
      .replace(quantityPattern, '')
      .trim();
    
    // Skip if no meaningful description
    if (!description) return;
    
    lineItems.push({
      description,
      quantity,
      price,
    });
  });

  return lineItems;
} 