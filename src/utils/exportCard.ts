import html2canvas from 'html2canvas';
import { toBlob } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Ensures all fonts and images inside the element are completely loaded and decoded before capture.
 */
const prepareElementForExport = async (element: HTMLElement): Promise<void> => {
  // 1. Wait for document fonts to load completely
  try {
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  } catch (e) {
    console.warn('[Export] Font readiness check skipped:', e);
  }

  // 2. Pre-decode all img elements inside the card
  const images = Array.from(element.querySelectorAll('img'));
  const loadPromises = images.map(async (img) => {
    try {
      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
      if ('decode' in img && typeof img.decode === 'function') {
        await img.decode().catch(() => {});
      }
    } catch (e) {
      console.warn('[Export] Image decode skipped for:', img.src, e);
    }
  });

  await Promise.all(loadPromises);

  // 3. Convert external cross-origin images to Data URLs to prevent canvas tainting
  await Promise.all(
    images.map(async (img) => {
      if (!img.src || img.src.startsWith('data:') || img.src.startsWith('blob:')) return;
      try {
        const response = await fetch(img.src, { mode: 'cors', cache: 'force-cache' });
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(blob);
          });
          if (dataUrl) {
            img.src = dataUrl;
          }
        }
      } catch (corsErr) {
        console.warn('[Export] Failed to convert image to Data URL:', img.src, corsErr);
      }
    })
  );

  // Short delay for layout stabilization
  await new Promise((resolve) => setTimeout(resolve, 150));
};

/**
 * Converts a Base64 Data URL to a Blob safely.
 */
const dataUrlToBlob = (dataUrl: string): Blob => {
  const parts = dataUrl.split(',');
  const mimeMatch = parts[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bin = atob(parts[1]);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    u8[i] = bin.charCodeAt(i);
  }
  return new Blob([u8], { type: mime });
};

/**
 * Triggers file download or Web Share sheet on mobile browsers.
 */
const triggerFileDownload = async (blob: Blob, filename: string, dataUrl?: string): Promise<boolean> => {
  const file = new File([blob], filename, { type: 'image/png' });

  // 1. Try Web Share API for seamless saving on Mobile Safari (iOS) and Android
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'शुभ निमंत्रण पत्र',
          text: 'डिजिटल निमंत्रण कार्ड'
        });
        return true;
      }
    } catch (shareErr: any) {
      if (shareErr.name !== 'AbortError') {
        console.warn('[Export] Web share failed, falling back to download link:', shareErr);
      } else {
        // User closed the share sheet
        return true;
      }
    }
  }

  // 2. Standard Blob Object URL download link
  try {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    return true;
  } catch (linkErr) {
    console.warn('[Export] Blob link download failed, trying popup/window:', linkErr);
  }

  // 3. Fallback: Open Data URL or Blob URL in new window
  if (dataUrl) {
    try {
      const newWin = window.open();
      if (newWin) {
        newWin.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${filename}</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; background: #222; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; color: #fff; font-family: sans-serif; text-align: center; padding: 20px; box-sizing: border-box; }
                img { max-width: 95%; height: auto; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-bottom: 20px; }
                p { font-size: 14px; color: #ffd700; margin-bottom: 15px; }
              </style>
            </head>
            <body>
              <p>इमेज पर थोड़ी देर टैप करके रखें और 'Save Image' या 'Save to Photos' चुनें</p>
              <img src="${dataUrl}" alt="${filename}" />
            </body>
          </html>
        `);
        return true;
      }
    } catch (winErr) {
      console.warn('[Export] New window fallback failed:', winErr);
    }
  }

  return false;
};

/**
 * Exports a specific DOM element (the rendered card) as a high-resolution PNG image.
 */
export const exportCardAsImage = async (
  elementId: string = 'card-render-container',
  filename: string = 'shubh_nimantran_invitation.png'
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('कार्ड एलिमेंट नहीं मिला। कृपया कार्ड खुला रखकर पुनः प्रयास करें।');
    return false;
  }

  const originalScrollX = typeof window !== 'undefined' ? window.scrollX : 0;
  const originalScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

  try {
    // 1. Prepare element (fonts, images, CORS, layout)
    await prepareElementForExport(element);

    // Scroll to top-left to avoid html2canvas scrollY offset clipping bug on mobile
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    let pngBlob: Blob | null = null;
    let finalDataUrl: string | undefined = undefined;

    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const scaleFactor = isMobile ? 1.5 : 2; // Prevents iOS Safari 4096px canvas size overflow limit

    // --- STAGE 1: Optimized html2canvas with allowTaint: false ---
    try {
      console.log('[Shubh Nimantran Export] Attempting Stage 1: html2canvas');
      const canvas = await html2canvas(element, {
        scale: scaleFactor,
        useCORS: true,
        allowTaint: false, // CRITICAL: NEVER set allowTaint: true as toDataURL will throw SecurityError
        logging: false,
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById(elementId);
          if (clonedEl) {
            clonedEl.style.transform = 'none';
            clonedEl.style.animation = 'none';
          }
        }
      });

      finalDataUrl = canvas.toDataURL('image/png', 1.0);
      pngBlob = dataUrlToBlob(finalDataUrl);
      console.log('[Shubh Nimantran Export] Stage 1 (html2canvas) succeeded, blob size:', pngBlob.size);
    } catch (h2cErr) {
      console.warn('[Shubh Nimantran Export] Stage 1 (html2canvas) failed:', h2cErr);
    }

    // --- STAGE 2: Secondary html-to-image fallback ---
    if (!pngBlob || pngBlob.size < 1000) {
      try {
        console.log('[Shubh Nimantran Export] Attempting Stage 2: html-to-image');
        pngBlob = await toBlob(element, {
          quality: 0.98,
          pixelRatio: scaleFactor,
          cacheBust: true,
          style: {
            transform: 'none',
            animation: 'none'
          }
        });

        if (pngBlob) {
          finalDataUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(pngBlob!);
          });
          console.log('[Shubh Nimantran Export] Stage 2 (html-to-image) succeeded, blob size:', pngBlob.size);
        }
      } catch (htiErr) {
        console.warn('[Shubh Nimantran Export] Stage 2 (html-to-image) failed:', htiErr);
      }
    }

    // Restore scroll position
    if (typeof window !== 'undefined') {
      window.scrollTo(originalScrollX, originalScrollY);
    }

    if (!pngBlob || pngBlob.size < 100) {
      throw new Error('इमेज कैप्चर करने में विफलता आई (Canvas is empty)');
    }

    // Trigger download or mobile share sheet
    const success = await triggerFileDownload(pngBlob, filename, finalDataUrl);
    if (!success) {
      alert('कार्ड की इमेज डाउनलोड नहीं हो सकी। आप प्रिंट / PDF विकल्प का उपयोग भी कर सकते हैं।');
      return false;
    }

    return true;
  } catch (err: any) {
    if (typeof window !== 'undefined') {
      window.scrollTo(originalScrollX, originalScrollY);
    }
    console.error('[Shubh Nimantran Export Error]', err);
    alert('इमेज एक्सपोर्ट करने में समस्या आई: ' + (err?.message || 'अज्ञात त्रुटि') + '। आप प्रिंट / PDF विकल्प का उपयोग भी कर सकते हैं।');
    return false;
  }
};

/**
 * Triggers file download or Web Share sheet for PDF on mobile browsers / iPad Safari.
 */
const triggerPdfDownload = async (blob: Blob, filename: string, pdfInstance?: jsPDF): Promise<boolean> => {
  const file = new File([blob], filename, { type: 'application/pdf' });

  // 1. Try Web Share API for seamless saving on Mobile Safari (iOS / iPad) and Android
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'शुभ निमंत्रण पत्र (PDF)',
          text: 'डिजिटल निमंत्रण कार्ड PDF'
        });
        return true;
      }
    } catch (shareErr: any) {
      if (shareErr.name === 'AbortError') {
        return true; // User closed share sheet intentionally
      }
      console.warn('[Export] Web share for PDF failed, trying direct blob download:', shareErr);
    }
  }

  // 2. Standard Blob Object URL download link
  try {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    return true;
  } catch (linkErr) {
    console.warn('[Export] Blob link download failed for PDF:', linkErr);
  }

  // 3. Fallback to native jsPDF save method
  if (pdfInstance) {
    try {
      pdfInstance.save(filename);
      return true;
    } catch (saveErr) {
      console.warn('[Export] pdf.save() fallback failed:', saveErr);
    }
  }

  return false;
};

/**
 * Exports a specific DOM element (the rendered card) as a high-quality PDF document.
 */
export const exportCardAsPdf = async (
  elementId: string = 'card-render-container',
  filename: string = 'shubh_nimantran_invitation.pdf'
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('कार्ड एलिमेंट नहीं मिला। कृपया कार्ड खुला रखकर पुनः प्रयास करें।');
    return false;
  }

  const originalScrollX = typeof window !== 'undefined' ? window.scrollX : 0;
  const originalScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

  try {
    // 1. Prepare element (fonts, images, CORS, layout)
    await prepareElementForExport(element);

    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const scaleFactor = isMobile ? 1.5 : 2;

    const canvas = await html2canvas(element, {
      scale: scaleFactor,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: null,
      scrollX: 0,
      scrollY: 0,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.animation = 'none';
        }
      }
    });

    // Restore scroll position
    if (typeof window !== 'undefined') {
      window.scrollTo(originalScrollX, originalScrollY);
    }

    const imgData = canvas.toDataURL('image/png', 1.0);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Convert pixels to mm for jsPDF (standard 96 DPI CSS conversion: 1 px = 0.264583 mm)
    const mmWidth = (imgWidth / scaleFactor) * 0.264583;
    const mmHeight = (imgHeight / scaleFactor) * 0.264583;

    const pdf = new jsPDF({
      orientation: mmWidth > mmHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [mmWidth, mmHeight]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, mmWidth, mmHeight, undefined, 'FAST');
    const pdfBlob = pdf.output('blob');

    const success = await triggerPdfDownload(pdfBlob, filename, pdf);
    return success;
  } catch (err: any) {
    if (typeof window !== 'undefined') {
      window.scrollTo(originalScrollX, originalScrollY);
    }
    console.error('[Shubh Nimantran PDF Export Error]', err);
    // Fallback to window.print if unexpected error occurs
    if (typeof window !== 'undefined') {
      try {
        window.print();
        return true;
      } catch (printErr) {
        alert('PDF डाउनलोड करने में समस्या आई: ' + (err?.message || 'अज्ञात त्रुटि'));
      }
    }
    return false;
  }
};
