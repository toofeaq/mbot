import React from 'react';
import { Printer, FileDown, Eye, CreditCard, Table2, ClipboardList } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface TopBarProps {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  previewType: 'badge' | 'holder' | 'attendance';
  onPreviewTypeChange: (type: 'badge' | 'holder' | 'attendance') => void;
  previewRef: React.RefObject<HTMLDivElement>;
}

export default function TopBar({ 
  isPreviewMode, 
  onTogglePreview, 
  previewType,
  onPreviewTypeChange,
  previewRef 
}: TopBarProps) {
  const handlePrint = () => {
    if (!previewRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch {
          return '';
        }
      })
      .join('\n');

    const content = previewRef.current.cloneNode(true) as HTMLElement;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print ${
            previewType === 'badge' 
              ? 'Badges' 
              : previewType === 'holder' 
                ? 'Name Holders' 
                : 'Attendance Sheet'
          }</title>
          <style>
            ${styles}
            @page { margin: 0; size: auto; }
            body { margin: 0.5cm; }
            .page { page-break-after: always; break-inside: avoid; }
            .page:last-child { page-break-after: avoid; }
            .print-preview { width: 100%; height: 100%; }
            .no-print { display: none !important; }
            .hidden { display: block !important; }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    
    const images = printWindow.document.getElementsByTagName('img');
    if (images.length > 0) {
      let loadedImages = 0;
      Array.from(images).forEach(img => {
        if (img.complete) {
          loadedImages++;
          if (loadedImages === images.length) {
            setTimeout(() => {
              printWindow.focus();
              printWindow.print();
              printWindow.close();
            }, 500);
          }
        } else {
          img.onload = () => {
            loadedImages++;
            if (loadedImages === images.length) {
              setTimeout(() => {
                printWindow.focus();
                printWindow.print();
                printWindow.close();
              }, 500);
            }
          };
        }
      });
    } else {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;

    const pagesContainer = previewRef.current.querySelector('.print\\:block') as HTMLElement;
    if (!pagesContainer) return;

    const originalDisplay = pagesContainer.style.display;
    pagesContainer.style.display = 'block';

    const pages = pagesContainer.getElementsByClassName('page');
    if (pages.length === 0) {
      pagesContainer.style.display = originalDisplay;
      return;
    }

    try {
      const firstPage = pages[0] as HTMLElement;
      const scale = 2;
      const firstCanvas = await html2canvas(firstPage, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const styles = Array.from(document.styleSheets)
            .map(styleSheet => {
              try {
                return Array.from(styleSheet.cssRules)
                  .map(rule => rule.cssText)
                  .join('\n');
              } catch {
                return '';
              }
            })
            .join('\n');
          
          const styleElement = clonedDoc.createElement('style');
          styleElement.textContent = styles;
          clonedDoc.head.appendChild(styleElement);
        }
      });

      const pageWidth = firstCanvas.width / scale;
      const pageHeight = firstCanvas.height / scale;
      const pdf = new jsPDF({
        orientation: pageHeight > pageWidth ? 'portrait' : 'landscape',
        unit: 'px',
        format: [pageWidth, pageHeight]
      });

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        const images = page.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));

        page.style.display = 'grid';
        
        const canvas = await html2canvas(page, {
          scale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        if (i > 0) {
          pdf.addPage([pageWidth, pageHeight]);
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, '', 'FAST');
        
        page.style.display = 'none';
      }

      pdf.save(`${previewType === 'badge' ? 'badges' : previewType === 'holder' ? 'name-holders' : 'attendance-sheet'}.pdf`);
    } finally {
      pagesContainer.style.display = originalDisplay;
    }
  };

  return (
    <div className="bg-white border-b print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onTogglePreview}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                isPreviewMode
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>

            <div className="border-l pl-4 flex items-center space-x-2">
              <button
                onClick={() => onPreviewTypeChange('badge')}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  previewType === 'badge'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Badges
              </button>
              <button
                onClick={() => onPreviewTypeChange('holder')}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  previewType === 'holder'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Table2 className="h-4 w-4 mr-2" />
                Name Holders
              </button>
              <button
                onClick={() => onPreviewTypeChange('attendance')}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  previewType === 'attendance'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Attendance Sheet
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}