import React from 'react';
import type { LogoConfig, BadgeColors } from '../App';

interface BadgeProps {
  name: string;
  englishName: string;
  companyName: string;
  logos: LogoConfig[];
  width: number;
  height: number;
  colors: BadgeColors;
  showEnglishName: boolean;
}

export default function Badge({
  name,
  englishName,
  companyName,
  logos,
  width,
  height,
  colors,
  showEnglishName
}: BadgeProps) {
  const getLogoStyle = (logo: LogoConfig, index: number) => {
    const totalLogos = logos.length;
    const logoSize = logo.size || Math.min(width * 0.25, 64);
    const totalWidth = totalLogos * logoSize;
    const containerWidth = width - 48; // Account for padding
    
    let leftPosition = 24; // Default left padding
    
    if (logo.alignment === 'center') {
      const startX = (containerWidth - totalWidth) / 2;
      leftPosition = startX + (index * logoSize);
    } else if (logo.alignment === 'right') {
      const startX = containerWidth - totalWidth;
      leftPosition = startX + (index * logoSize);
    } else { // left alignment
      leftPosition = 24 + (index * logoSize);
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
      top: logo.spacing?.top ? `${24 + logo.spacing.top}px` : '24px',
      left: `${leftPosition}px`
    };

    return style;
  };

  return (
    <div 
      className="relative flex flex-col overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: colors.background,
        border: `2px solid ${colors.border}`,
      }}
    >
      {/* Logo Section */}
      <div className="relative h-24 w-full">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.url}
            alt="Company logo"
            style={getLogoStyle(logo, index)}
          />
        ))}
      </div>

      {/* Name Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-8 text-center">
        <h2 
          className="text-4xl font-bold mb-2" 
          style={{ color: colors.text }}
          dir="rtl"
        >
          {name}
        </h2>
        {showEnglishName && englishName && (
          <h3 
            className="text-2xl font-semibold"
            style={{ color: colors.text }}
          >
            {englishName}
          </h3>
        )}
      </div>

      {/* Footer */}
      <div 
        className="p-4 text-center"
        style={{ backgroundColor: colors.footer }}
      >
        <p 
          className="text-lg font-medium"
          style={{ color: colors.footerText }}
        >
          {companyName}
        </p>
      </div>
    </div>
  );
}