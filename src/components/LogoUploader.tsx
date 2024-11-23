import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlignLeft, AlignCenter, AlignRight, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import type { LogoConfig } from '../App';

interface LogoUploaderProps {
  onLogoUpload: (files: File[]) => void;
  onLogoAlignmentChange: (index: number, alignment: 'left' | 'center' | 'right') => void;
  onLogoDelete: (index: number) => void;
  onLogoSpacingChange: (index: number, spacing: { top: number; right: number; bottom: number; left: number }) => void;
  onLogoSizeChange: (index: number, size: number) => void;
  logos: LogoConfig[];
  maxLogos: number;
}

export default function LogoUploader({ 
  onLogoUpload, 
  onLogoAlignmentChange,
  onLogoDelete,
  onLogoSpacingChange,
  onLogoSizeChange,
  logos, 
  maxLogos 
}: LogoUploaderProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    maxFiles: maxLogos,
    onDrop: onLogoUpload
  });

  const handleSpacingChange = (index: number, key: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    const currentSpacing = logos[index].spacing || { top: 0, right: 0, bottom: 0, left: 0 };
    const oppositeKey = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }[key] as 'top' | 'right' | 'bottom' | 'left';

    onLogoSpacingChange(index, {
      ...currentSpacing,
      [key]: value,
      [oppositeKey]: value
    });
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? 'Drop the logos here' : 'Drag & drop logos here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxLogos} logo{maxLogos > 1 ? 's' : ''} allowed
        </p>
      </div>

      {logos.length > 0 && (
        <div className="space-y-4">
          {logos.map((logo, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <img 
                  src={logo.url} 
                  alt="Logo preview" 
                  className="h-8 w-8 object-contain" 
                  style={{ height: `${logo.size || 32}px` }}
                />
                <div className="flex items-center space-x-2">
                  {[
                    { value: 'left', icon: AlignLeft },
                    { value: 'center', icon: AlignCenter },
                    { value: 'right', icon: AlignRight }
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => onLogoAlignmentChange(index, value as 'left' | 'center' | 'right')}
                      className={`p-2 rounded ${
                        logo.alignment === value
                          ? 'bg-purple-100 text-purple-600'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                  <button
                    onClick={() => onLogoDelete(index)}
                    className="p-2 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-xs text-gray-500 mb-1">
                    <Maximize2 className="h-3 w-3 mr-1" />
                    Size (px)
                  </label>
                  <input
                    type="number"
                    value={logo.size || 32}
                    onChange={(e) => onLogoSizeChange(index, parseInt(e.target.value) || 32)}
                    className="w-full p-2 text-sm border rounded-md"
                    min="16"
                    max="128"
                  />
                </div>
                <div>
                  <label className="flex items-center text-xs text-gray-500 mb-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    Vertical Spacing (px)
                  </label>
                  <input
                    type="number"
                    value={logo.spacing?.top || 0}
                    onChange={(e) => handleSpacingChange(index, 'top', parseInt(e.target.value) || 0)}
                    className="w-full p-2 text-sm border rounded-md"
                  />
                </div>
                <div>
                  <label className="flex items-center text-xs text-gray-500 mb-1">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Horizontal Spacing (px)
                  </label>
                  <input
                    type="number"
                    value={logo.spacing?.right || 0}
                    onChange={(e) => handleSpacingChange(index, 'right', parseInt(e.target.value) || 0)}
                    className="w-full p-2 text-sm border rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}