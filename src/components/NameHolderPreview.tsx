import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import NameHolder from './NameHolder';
import type { LogoConfig, NameEntry } from '../App';

interface NameHolderPreviewProps {
  names: NameEntry[];
  logos: LogoConfig[];
  holderSize: { width: number; height: number };
  holderColors: { border: string; background: string; text: string };
  showEnglishName: boolean;
}

export default function NameHolderPreview({
  names,
  logos,
  holderSize,
  holderColors,
  showEnglishName
}: NameHolderPreviewProps) {
  const saveAsPDF = async () => {
    const pdf = new jsPDF({
      orientation: holderSize.width > holderSize.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [holderSize.width + 40, holderSize.height + 40] // Add margins
    });

    for (let i = 0; i < names.length; i++) {
      const holder = document.getElementById(`name-holder-${i}`);
      if (holder) {
        const canvas = await html2canvas(holder, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        if (i > 0) {
          pdf.addPage([holderSize.width + 40, holderSize.height + 40]);
        }
        
        pdf.addImage(
          imgData, 
          'JPEG', 
          20, // Left margin
          20, // Top margin
          holderSize.width,
          holderSize.height,
          '', 
          'FAST'
        );
      }
    }

    pdf.save('name-holders.pdf');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none print:p-0">
        <div className="grid gap-8 grid-cols-1">
          {names.map((name, index) => (
            <div 
              key={index} 
              id={`name-holder-${index}`}
              className="flex justify-center items-center page"
            >
              <NameHolder
                name={name.arabic}
                englishName={name.english}
                logos={logos}
                width={holderSize.width}
                height={holderSize.height}
                borderColor={holderColors.border}
                backgroundColor={holderColors.background}
                textColor={holderColors.text}
                showEnglishName={showEnglishName}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}