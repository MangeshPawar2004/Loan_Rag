import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

/**
 * Extracts all text from a PDF file (given as a Blob or File object).
 * Returns a single string containing the entire document’s text.
 */
export async function extractTextFromPdfFile(fileBlob) {
  const arrayBuffer = await fileBlob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const txt = await page.getTextContent();
    const pageText = txt.items.map(i => i.str).join(' ');
    fullText += '\n\n' + pageText;
  }

  return fullText;
}
