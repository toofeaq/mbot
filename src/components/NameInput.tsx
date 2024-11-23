import React, { useState, useEffect } from 'react';
import type { NameEntry } from '../App';

interface NameInputProps {
  names: NameEntry[];
  onNamesChange: (names: NameEntry[]) => void;
}

export default function NameInput({ names, onNamesChange }: NameInputProps) {
  const [arabicText, setArabicText] = useState('');
  const [englishText, setEnglishText] = useState('');

  useEffect(() => {
    if (names.length > 0) {
      setArabicText(names.map(n => n.arabic).join('\n'));
      setEnglishText(names.map(n => n.english).join('\n'));
    }
  }, []);

  const handleArabicChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setArabicText(text);
    updateNames(text, englishText);
  };

  const handleEnglishChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setEnglishText(text);
    updateNames(arabicText, text);
  };

  const updateNames = (arabic: string, english: string) => {
    const arabicNames = arabic.split(/[\n]+/).filter(name => name.trim());
    const englishNames = english.split(/[\n]+/).filter(name => name.trim());
    
    const maxLength = Math.max(arabicNames.length, englishNames.length);
    const newNames: NameEntry[] = [];

    for (let i = 0; i < maxLength; i++) {
      newNames.push({
        arabic: arabicNames[i] || '',
        english: englishNames[i] || ''
      });
    }

    onNamesChange(newNames);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Arabic Names
          </label>
          <textarea
            className="w-full h-40 p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="أدخل الأسماء العربية (اسم واحد في كل سطر)"
            value={arabicText}
            onChange={handleArabicChange}
            dir="rtl"
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            English Names
          </label>
          <textarea
            className="w-full h-40 p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter English names (one name per line)"
            value={englishText}
            onChange={handleEnglishChange}
            style={{ whiteSpace: 'pre-wrap' }}
          />
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        {names.length} name{names.length !== 1 ? 's' : ''} added
      </div>
    </div>
  );
}