import React from 'react';
import type { LogoConfig } from '../App';

interface NameHolderProps {
  name: string;
  englishName: string;
  logos: LogoConfig[];
  width: number;
  height: number;
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  showEnglishName: boolean;
}

export default function NameHolder({
  name,
  englishName,
  logos,
  width,
  height,
  borderColor,
  backgroundColor,
  textColor,
  showEnglishName
}: NameHolderProps) {
  const getLogoStyle = (logo: LogoConfig, index: number) => {
    const totalLogos = logos.length;
    const logoSize = logo.size || Math.min(width * 0.15, 48);
    const totalWidth = totalLogos * logoSize;
    const containerWidth = width - 24; // Account for padding
    
    let leftPosition = 12; // Default left padding
    
    if (logo.alignment === 'center') {
      const startX = (containerWidth - totalWidth) / 2;
      leftPosition = startX + (index * logoSize);
    } else if (logo.alignment === 'right') {
      const startX = containerWidth - totalWidth;
      leftPosition = startX + (index * logoSize);
    } else { // left alignment
      leftPosition = 12 + (index * logoSize);
    }

    // Apply custom spacing if defined
    if (logo.spacing) {
      leftPosition += logo.spacing.left;
    }

    const style: React.CSSProperties = {
      height: `${logoSize}px`,
      width: `${logoSize}px`,
      objectFit: 'contain',
      position: 'absolute',
      top: logo.spacing?.top ? `${12 + logo.spacing.top}px` : '12px',
      left: `${leftPosition}px`
    };

    return style;
  };

  return (
    <div 
      className="relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor,
        border: `2px solid ${borderColor}`,
      }}
    >
      {/* Logos */}
      <div className="relative h-16 w-full">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.url}
            alt="Logo"
            style={getLogoStyle(logo, index)}
          />
        ))}
      </div>

      {/* Name Section */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 px-4 text-center"
      >
        <h2 
          className="text-2xl font-bold mb-1" 
          style={{ color: textColor }}
          dir="rtl"
        >
          {name}
        </h2>
        {showEnglishName && englishName && (
          <h3 
            className="text-xl font-semibold"
            style={{ color: textColor }}
          >
            {englishName}
          </h3>
        )}
      </div>
    </div>
  );
}