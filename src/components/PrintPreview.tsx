import React from 'react';
import Badge from './Badge';
import type { LogoConfig, BadgeSize, PaperSize, BadgeColors, NameEntry } from '../App';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PrintPreviewProps {
  names: NameEntry[];
  companyName: string;
  logos: LogoConfig[];
  badgeSize: BadgeSize;
  paperSize: PaperSize;
  badgeColors: BadgeColors;
  showEnglishName: boolean;
}

export default function PrintPreview({
  names,
  companyName,
  logos,
  badgeSize,
  paperSize,
  badgeColors,
  showEnglishName
}: PrintPreviewProps) {
  const [currentPage, setCurrentPage] = React.useState(0);

  const badgesPerPage = paperSize === 'A3' ? 6 : 2;
  const totalPages = Math.ceil(names.length / badgesPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  // Generate all pages for printing
  const allPages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const pageBadges = names.slice(pageIndex * badgesPerPage, (pageIndex + 1) * badgesPerPage);
    
    return (
      <div 
        key={pageIndex}
        className={`page grid gap-8 ${paperSize === 'A3' ? 'grid-cols-3' : 'grid-cols-2'}`}
        style={{
          aspectRatio: paperSize === 'A3' ? '297/420' : '210/297',
          display: pageIndex === currentPage ? 'grid' : 'none',
        }}
      >
        {pageBadges.map((name, index) => (
          <div key={index} className="flex justify-center items-center">
            <Badge
              name={name.arabic}
              englishName={name.english}
              companyName={companyName}
              logos={logos}
              width={badgeSize.width}
              height={badgeSize.height}
              colors={badgeColors}
              showEnglishName={showEnglishName}
            />
          </div>
        ))}
      </div>
    );
  });

  // Hidden container with all pages for printing
  const allPagesForPrint = (
    <div className="hidden print:block">
      {Array.from({ length: totalPages }, (_, pageIndex) => {
        const pageBadges = names.slice(pageIndex * badgesPerPage, (pageIndex + 1) * badgesPerPage);
        
        return (
          <div 
            key={pageIndex}
            className={`page grid gap-8 ${paperSize === 'A3' ? 'grid-cols-3' : 'grid-cols-2'}`}
            style={{
              aspectRatio: paperSize === 'A3' ? '297/420' : '210/297',
            }}
          >
            {pageBadges.map((name, index) => (
              <div key={index} className="flex justify-center items-center">
                <Badge
                  name={name.arabic}
                  englishName={name.english}
                  companyName={companyName}
                  logos={logos}
                  width={badgeSize.width}
                  height={badgeSize.height}
                  colors={badgeColors}
                  showEnglishName={showEnglishName}
                />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none print:p-0">
        {/* Current page for display */}
        {allPages}
        {/* All pages for printing */}
        {allPagesForPrint}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 print:hidden">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6 text-[#822378]" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6 text-[#822378]" />
          </button>
        </div>
      )}
    </div>
  );
}