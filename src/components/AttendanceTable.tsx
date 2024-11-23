import React from 'react';

interface Field {
  id: string;
  name: string;
  label: string;
  labelAr: string;
  enabled: boolean;
  order: number;
  isCustom?: boolean;
}

interface AttendanceTableProps {
  fields: Field[];
  rows: Array<{ number: number; name: { arabic: string; english: string } }>;
  signatureDays: number;
}

export default function AttendanceTable({
  fields,
  rows,
  signatureDays
}: AttendanceTableProps) {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);
  const enabledFields = sortedFields.filter(f => f.enabled);

  return (
    <div id="attendance-sheet" className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {enabledFields.map(field => (
              <th
                key={field.id}
                className="px-6 py-3 text-right text-xs font-medium text-[#822378] uppercase tracking-wider"
              >
                {field.labelAr}
                <br />
                {field.label}
              </th>
            ))}
            {Array.from({ length: signatureDays }).map((_, index) => (
              <th
                key={`signature-${index}`}
                className="px-6 py-3 text-right text-xs font-medium text-[#822378] uppercase tracking-wider"
              >
                {signatureDays > 1 ? `التوقيع - يوم ${index + 1}` : 'التوقيع'}
                <br />
                {signatureDays > 1 ? `Signature - Day ${index + 1}` : 'Signature'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={index}>
              {enabledFields.map(field => (
                <td key={field.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {field.id === 'number' && row.number}
                  {field.id === 'code' && (
                    <div>
                      <div className="text-right" dir="rtl">رمز {row.number.toString().padStart(3, '0')}</div>
                      <div>CODE {row.number.toString().padStart(3, '0')}</div>
                    </div>
                  )}
                  {field.id === 'name' && (
                    <div>
                      <div className="text-right">{row.name.arabic}</div>
                      <div>{row.name.english}</div>
                    </div>
                  )}
                  {field.id === 'workplace' && ''}
                  {field.id === 'residence' && ''}
                  {field.id === 'idCheck' && (
                    <div className="space-y-1 text-right">
                      <div>
                        <input type="checkbox" className="ml-2" defaultChecked={false} /> نعم
                      </div>
                      <div>
                        <input type="checkbox" className="ml-2" defaultChecked={false} /> كلا
                      </div>
                    </div>
                  )}
                  {field.isCustom && ''}
                </td>
              ))}
              {Array.from({ length: signatureDays }).map((_, dayIndex) => (
                <td key={`signature-${dayIndex}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}