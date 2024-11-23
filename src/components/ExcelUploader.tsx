import React from 'react';
import { FileSpreadsheet, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { NameEntry } from '../App';

interface ExcelUploaderProps {
  onNamesImport: (names: NameEntry[]) => void;
}

export default function ExcelUploader({ onNamesImport }: ExcelUploaderProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet) as Array<{ arabic: string; english: string }>;
      
      const names: NameEntry[] = jsonData.map(row => ({
        arabic: row.arabic || '',
        english: row.english || ''
      }));

      onNamesImport(names);
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const template = [
      { arabic: 'الاسم بالعربي', english: 'Name in English' },
      { arabic: 'محمد أحمد', english: 'Mohammed Ahmed' },
      { arabic: 'فاطمة علي', english: 'Fatima Ali' }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Names Template');
    
    // Auto-size columns
    const colWidths = [
      { wch: 20 }, // arabic column
      { wch: 20 }  // english column
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'badge-names-template.xlsx');
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <label
          htmlFor="excel-upload"
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
        >
          <FileSpreadsheet className="h-5 w-5 mr-2 text-[#822378]" />
          Import from Excel
        </label>
        <button
          onClick={downloadTemplate}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FileDown className="h-5 w-5 mr-2 text-[#822378]" />
          Download Template
        </button>
      </div>
      <input
        id="excel-upload"
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />
      <div className="text-sm text-gray-500">
        <p>Supported Excel format:</p>
        <ul className="list-disc list-inside ml-2">
          <li>Column A: Arabic names</li>
          <li>Column B: English names</li>
          <li>One name per row</li>
        </ul>
      </div>
    </div>
  );
}