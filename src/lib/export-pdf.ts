"use client";

import jsPDF from "jspdf";
import { toPng } from "html-to-image";

/**
 * Intelligent PDF Export: Slices image by detecting component boundaries
 * to prevent splitting text or UI blocks across pages.
 */
export const exportToPDF = async (elementId: string, filename: string = "quotation.pdf") => {
  const element = document.querySelector("#editor-canvas [class*='w-[210mm]']") as HTMLElement;
  
  if (!element) {
    console.error("A4 Canvas element not found");
    return;
  }

  try {
    // 1. Gather section boundaries before making any style changes
    const containerRect = element.getBoundingClientRect();
    const sections = Array.from(element.querySelectorAll(".pdf-section")).map(sec => {
      const rect = sec.getBoundingClientRect();
      return {
        top: (rect.top - containerRect.top),
        bottom: (rect.bottom - containerRect.top),
        height: rect.height
      };
    });

    // 2. Prepare for clean capture
    const originalStyle = element.getAttribute("style") || "";
    element.style.boxShadow = "none";
    element.style.transform = "none";
    element.style.height = "auto";
    element.style.minHeight = "auto";
    element.style.overflow = "visible";
    element.classList.add("is-exporting-pdf");

    // 3. Capture high-res PNG
    const fullDataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2.5,
      backgroundColor: "#ffffff",
      filter: (node) => {
        const classList = (node as HTMLElement).classList;
        if (classList) {
          return !classList.contains("no-print") && 
                 !classList.contains("bn-side-menu") && 
                 !classList.contains("bn-drag-handle");
        }
        return true;
      },
    });

    element.classList.remove("is-exporting-pdf");
    element.setAttribute("style", originalStyle);

    const img = new Image();
    img.src = fullDataUrl;
    
    await new Promise((resolve) => {
      img.onload = async () => {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true
        });

        const MARGIN_DEFAULT = 15;
        const PAGE_WIDTH = 210;
        const PAGE_HEIGHT = 297;
        
        // Pixel to MM conversion factor
        const pxToMm = PAGE_WIDTH / img.width;
        const totalImgHeightMm = img.height * pxToMm;
        
        // Convert sections to MM
        const sectionsMm = sections.map(s => ({
          top: s.top * pxToMm,
          bottom: s.bottom * pxToMm,
          height: s.height * pxToMm
        }));

        let heightLeft = totalImgHeightMm;
        let currentSourceY = 0;
        let pageIndex = 0;

        while (heightLeft > 0.5) { // Small threshold to avoid empty last page
          if (pageIndex > 0) pdf.addPage();

          const marginTop = (pageIndex === 0) ? 0 : MARGIN_DEFAULT;
          const marginBottom = MARGIN_DEFAULT;
          const maxPossibleContentHeight = PAGE_HEIGHT - marginTop - marginBottom;
          
          let displayHeightMm = Math.min(heightLeft, maxPossibleContentHeight);

          // --- Intelligent Split Detection ---
          // If we are not on the last bit of content, check if we're cutting a section
          if (heightLeft > maxPossibleContentHeight) {
            const splitLineY = currentSourceY + displayHeightMm;
            
            // Find if any section is being crossed by the split line
            const crossedSection = sectionsMm.find(s => 
              s.top < splitLineY && s.bottom > splitLineY
            );

            // If a section is crossed and it's not too huge to fit on one page anyway
            if (crossedSection && crossedSection.height <= maxPossibleContentHeight) {
              // Adjust displayHeightMm to stop BEFORE this section
              displayHeightMm = crossedSection.top - currentSourceY;
            }
          }

          // Slice and Add
          const sourceYPx = (currentSourceY * img.width) / PAGE_WIDTH;
          const sourceHeightPx = (displayHeightMm * img.width) / PAGE_WIDTH;
          
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = sourceHeightPx;
          const ctx = canvas.getContext("2d");
          
          if (ctx) {
            ctx.drawImage(img, 0, sourceYPx, img.width, sourceHeightPx, 0, 0, img.width, sourceHeightPx);
            const sliceDataUrl = canvas.toDataURL("image/png");
            
            pdf.addImage(sliceDataUrl, "PNG", 0, marginTop, PAGE_WIDTH, displayHeightMm, undefined, "FAST");
          }

          currentSourceY += displayHeightMm;
          heightLeft -= displayHeightMm;
          pageIndex++;
        }

        pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
        resolve(true);
      };
    });
    
    return true;
  } catch (error) {
    console.error("PDF Export failed:", error);
    throw error;
  }
};
