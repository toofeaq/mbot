import React from 'react';
import Accordion from './Accordion';

interface NameHolderSettingsProps {
  holderSize: { width: number; height: number };
  onHolderSizeChange: (size: { width: number; height: number }) => void;
  holderColors: { border: string; background: string; text: string };
  onHolderColorsChange: (colors: { border: string; background: string; text: string }) => void;
}

export default function NameHolderSettings({
  holderSize,
  onHolderSizeChange,
  holderColors,
  onHolderColorsChange
}: NameHolderSettingsProps) {
  return (
    <Accordion title="Name Holder Settings" defaultOpen={true}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Holder Dimensions (px)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Width</label>
              <input
                type="number"
                value={holderSize.width}
                onChange={(e) => onHolderSizeChange({
                  ...holderSize,
                  width: parseInt(e.target.value) || 0
                })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Height</label>
              <input
                type="number"
                value={holderSize.height}
                onChange={(e) => onHolderSizeChange({
                  ...holderSize,
                  height: parseInt(e.target.value) || 0
                })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Colors
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Border</label>
              <input
                type="color"
                value={holderColors.border}
                onChange={(e) => onHolderColorsChange({
                  ...holderColors,
                  border: e.target.value
                })}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Background</label>
              <input
                type="color"
                value={holderColors.background}
                onChange={(e) => onHolderColorsChange({
                  ...holderColors,
                  background: e.target.value
                })}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500">Text</label>
              <input
                type="color"
                value={holderColors.text}
                onChange={(e) => onHolderColorsChange({
                  ...holderColors,
                  text: e.target.value
                })}
                className="w-full h-10 p-1 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </Accordion>
  );
}