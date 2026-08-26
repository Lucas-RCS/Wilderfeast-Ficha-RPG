import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  fileName?: string;
  elementId?: string;
  onStart?: () => void;
  onProgress?: (step: string) => void;
  onComplete?: () => void;
  onError?: (err: Error) => void;
}

/**
 * Exports an HTML element directly into a multi-page A4 PDF using html2canvas & jsPDF.
 */
export async function exportElementToPDF(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    fileName = 'Wilderfeast_Ficha.pdf',
    onStart,
    onProgress,
    onComplete,
    onError
  } = options;

  try {
    if (onStart) onStart();
    if (onProgress) onProgress('Preparando documento para captura...');

    // Temporarily ensure the element is visible and styles are rendered cleanly
    const originalDisplay = element.style.display;
    const wasHidden = element.classList.contains('hidden');

    if (wasHidden) {
      element.classList.remove('hidden');
    }
    element.style.display = 'block';

    if (onProgress) onProgress('Renderizando visual de alta definição...');

    // Canvas generation
    const canvas = await html2canvas(element, {
      scale: 2, // 2x for sharp print resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200
    });

    // Restore classes
    if (wasHidden) {
      element.classList.add('hidden');
    }
    element.style.display = originalDisplay;

    if (onProgress) onProgress('Gerando arquivo PDF...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Additional pages if content spans beyond one page
    while (heightLeft > 5) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);

    if (onComplete) onComplete();
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Falha ao gerar PDF'));
    } else {
      // Fallback to native print
      window.print();
    }
  }
}
