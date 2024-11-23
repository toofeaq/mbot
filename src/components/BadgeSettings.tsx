import React, { useState } from 'react';
import type { PaperSize, BadgeSize, BadgeColors } from '../App';
import Accordion from './Accordion';

interface BadgeSettingsProps {
  paperSize: PaperSize;
  onPaperSizeChange: (size: PaperSize) => void;
  badgeSize: BadgeSize;
  onBadgeSizeChange: (size: BadgeSize) => void;
  badgeColors: BadgeColors;
  onBadgeColorsChange: (colors: BadgeColors) => void;
  showEnglishName: boolean;
  onShowEnglishNameChange: (show: boolean) => void;
}

export default function BadgeSettings({
  paperSize,
  onPaperSizeChange,
  badgeSize,
  onBadgeSizeChange,
  badgeColors,
  onBadgeColorsChange,
  showEnglishName,
  onShowEnglishNameChange
}: BadgeSettingsProps) {
  const [separateColors, setSeparateColors] = useState(false);

  const handleBorderColorChange = (color: string) => {
    if (separateColors) {
      onBadgeColorsChange({
        ...badgeColors,
        border: color
      });
    } else {
      onBadgeColorsChange({
        ...badgeColors,
        border: color,
        footer: color
      });
    }
  };

  const getBadgesPerPage = () => {
    const paperSizes = {
      A3: { width: 297, height: 420 },
      A4: { width: 210, height: 297 },
      A5: { width: 148, height: 210 }
    };

    const paper = paperSizes[paperSize];
    const pxPerMm = 96 / 25.4;
    const paperWidthPx = paper.width * pxPerMm;
    const paperHeightPx = paper.height * pxPerMm;
    const marginPx = 48;
    const spacingPx = 32;

    const availableWidth = paperWidthPx - (2 * marginPx);
    const availableHeight = paperHeightPx - (2 * marginPx);

    const badgesPerRow = Math.floor(availableWidth / (badgeSize.width + spacingPx));
    const badgesPerColumn = Math.floor(availableHeight / (badgeSize.height + spacingPx));

    return badgesPerRow * badgesPerColumn;
  };

  return (
    <Accordion title="Badge Settings" defaultOpen={true}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paper Size
          </label>
          <div className="space-y-2">
            <select
              value={paperSize}
              onChange={(e) => onPaperSizeChange(e.target.value as PaperSize)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="A3">A3</option>
              <option value="A4">A4</option>
              <option value="A5">A5</option>
            </select>
            <p className="text-sm text-gray-600">
              Badges per page: {getBadgesPerPage()}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Badge Dimensions (px)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Width</label>
              <input
                type="number"
                value={badgeSize.width}
                onChange={(e) => onBadgeSizeChange({
                  ...badgeSize,
                  width: parseInt(e.target.value) || 0
                })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Height</label>
              <input
                type="number"
                value={badgeSize.height}
                onChange={(e) => onBadgeSizeChange({
                  ...badgeSize,
                  height: parseInt(e.target.value) || 0
                })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Badge Colors
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="separateColors"
                checked={separateColors}
                onChange={(e) => setSeparateColors(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="separateColors" className="text-sm text-gray-700">
                Separate Border & Footer Colors
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Border</label>
              <input
                type="color"
                value={badgeColors.border}
                onChange={(e) => handleBorderColorChange(e.target.value)}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
            {separateColors && (
              <div>
                <label className="block text-xs text-gray-500">Footer</label>
                <input
                  type="color"
                  value={badgeColors.footer}
                  onChange={(e) => onBadgeColorsChange({
                    ...badgeColors,
                    footer: e.target.value
                  })}
                  className="w-full h-10 p-1 rounded-md"
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-500">Background</label>
              <input
                type="color"
                value={badgeColors.background}
                onChange={(e) => onBadgeColorsChange({
                  ...badgeColors,
                  background: e.target.value
                })}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Text</label>
              <input
                type="color"
                value={badgeColors.text}
                onChange={(e) => onBadgeColorsChange({
                  ...badgeColors,
                  text: e.target.value
                })}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Footer Text</label>
              <input
                type="color"
                value={badgeColors.footerText}
                onChange={(e) => onBadgeColorsChange({
                  ...badgeColors,
                  footerText: e.target.value
                })}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showEnglishName"
            checked={showEnglishName}
            onChange={(e) => onShowEnglishNameChange(e.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <label htmlFor="showEnglishName" className="text-sm text-gray-700">
            Show English Name
          </label>
        </div>
      </div>
    </Accordion>
  );
}