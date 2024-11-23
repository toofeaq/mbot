import React, { useState, useRef, useEffect } from 'react';
import TopBar from './components/TopBar';
import Accordion from './components/Accordion';
import NameInput from './components/NameInput';
import LogoUploader from './components/LogoUploader';
import BadgeSettings from './components/BadgeSettings';
import PrintPreview from './components/PrintPreview';
import NameHolderPreview from './components/NameHolderPreview';
import NameHolderSettings from './components/NameHolderSettings';
import ExcelUploader from './components/ExcelUploader';
import AttendanceSheet from './components/AttendanceSheet';

export interface LogoConfig {
  url: string;
  alignment: 'left' | 'center' | 'right';
  spacing?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  size?: number;
}

export interface NameEntry {
  arabic: string;
  english: string;
}

export type PaperSize = 'A3' | 'A4' | 'A5';
export type BadgeSize = { width: number; height: number };
export type BadgeColors = {
  border: string;
  background: string;
  text: string;
  footer: string;
  footerText: string;
};

export default function App() {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewType, setPreviewType] = useState<'badge' | 'holder' | 'attendance'>('badge');
  const [companyName, setCompanyName] = useState('');
  const [logos, setLogos] = useState<LogoConfig[]>([]);
  const [names, setNames] = useState<NameEntry[]>([]);
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [badgeSize, setBadgeSize] = useState<BadgeSize>({ width: 350, height: 500 });
  const [holderSize, setHolderSize] = useState<BadgeSize>({ width: 250, height: 100 });
  const [badgeColors, setBadgeColors] = useState<BadgeColors>({
    border: '#822378',
    background: '#ffffff',
    text: '#000000',
    footer: '#822378',
    footerText: '#ffffff'
  });
  const [holderColors, setHolderColors] = useState({
    border: '#822378',
    background: '#ffffff',
    text: '#000000'
  });
  const [showEnglishName, setShowEnglishName] = useState(true);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (files: File[]) => {
    const newLogos = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      alignment: 'left' as const
    }));
    setLogos(prev => [...prev, ...newLogos].slice(0, 3));
  };

  const handleLogoAlignmentChange = (index: number, alignment: 'left' | 'center' | 'right') => {
    setLogos(prev => prev.map((logo, i) => 
      i === index ? { ...logo, alignment } : logo
    ));
  };

  const handleLogoDelete = (index: number) => {
    setLogos(prev => prev.filter((_, i) => i !== index));
  };

  const handleLogoSpacingChange = (index: number, spacing: { top: number; right: number; bottom: number; left: number }) => {
    setLogos(prev => prev.map((logo, i) => 
      i === index ? { ...logo, spacing } : logo
    ));
  };

  const handleLogoSizeChange = (index: number, size: number) => {
    setLogos(prev => prev.map((logo, i) => 
      i === index ? { ...logo, size } : logo
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
        previewType={previewType}
        onPreviewTypeChange={setPreviewType}
        previewRef={previewRef}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {!isPreviewMode ? (
            <>
              <Accordion title="Company Information" defaultOpen={true}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Logo(s)
                    </label>
                    <LogoUploader
                      onLogoUpload={handleLogoUpload}
                      onLogoAlignmentChange={handleLogoAlignmentChange}
                      onLogoDelete={handleLogoDelete}
                      onLogoSpacingChange={handleLogoSpacingChange}
                      onLogoSizeChange={handleLogoSizeChange}
                      logos={logos}
                      maxLogos={3}
                    />
                  </div>
                </div>
              </Accordion>

              <Accordion title="Employee Names" defaultOpen={true}>
                <div className="space-y-4">
                  <NameInput names={names} onNamesChange={setNames} />
                  <ExcelUploader onNamesImport={setNames} />
                </div>
              </Accordion>

              {previewType === 'badge' ? (
                <BadgeSettings
                  paperSize={paperSize}
                  onPaperSizeChange={setPaperSize}
                  badgeSize={badgeSize}
                  onBadgeSizeChange={setBadgeSize}
                  badgeColors={badgeColors}
                  onBadgeColorsChange={setBadgeColors}
                  showEnglishName={showEnglishName}
                  onShowEnglishNameChange={setShowEnglishName}
                />
              ) : previewType === 'holder' ? (
                <NameHolderSettings
                  holderSize={holderSize}
                  onHolderSizeChange={setHolderSize}
                  holderColors={holderColors}
                  onHolderColorsChange={setHolderColors}
                />
              ) : null}
            </>
          ) : (
            <div ref={previewRef}>
              {previewType === 'badge' ? (
                <PrintPreview
                  names={names}
                  companyName={companyName}
                  logos={logos}
                  badgeSize={badgeSize}
                  paperSize={paperSize}
                  badgeColors={badgeColors}
                  showEnglishName={showEnglishName}
                />
              ) : previewType === 'holder' ? (
                <NameHolderPreview
                  names={names}
                  logos={logos}
                  holderSize={holderSize}
                  holderColors={holderColors}
                  showEnglishName={showEnglishName}
                />
              ) : (
                <AttendanceSheet
                  names={names}
                  logos={logos}
                  projectTitle={companyName}
                  activityTitle=""
                  subActivityTitle=""
                  location=""
                  date=""
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}