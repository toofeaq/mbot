import React from 'react';
import { Plus, GripVertical, CheckSquare } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  label: string;
  labelAr: string;
  enabled: boolean;
  order: number;
  isCustom?: boolean;
}

interface FieldSettingsProps {
  fields: Field[];
  language: 'ar' | 'en';
  onFieldToggle: (fieldId: string) => void;
  onFieldDragStart: (field: Field) => void;
  onFieldDragOver: (e: React.DragEvent, field: Field) => void;
  onFieldDragEnd: () => void;
  onAddCustomField: () => void;
}

export default function FieldSettings({
  fields,
  language,
  onFieldToggle,
  onFieldDragStart,
  onFieldDragOver,
  onFieldDragEnd,
  onAddCustomField
}: FieldSettingsProps) {
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#822378]">
          {language === 'ar' ? 'تخصيص الحقول' : 'Customize Fields'}
        </h3>
        <button
          onClick={onAddCustomField}
          className="flex items-center px-3 py-1 rounded-full bg-purple-100 text-[#822378] text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          {language === 'ar' ? 'إضافة حقل' : 'Add Field'}
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {sortedFields.map(field => (
          <div
            key={field.id}
            draggable
            onDragStart={() => onFieldDragStart(field)}
            onDragOver={(e) => onFieldDragOver(e, field)}
            onDragEnd={onFieldDragEnd}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 cursor-move ${
              field.enabled 
                ? 'bg-purple-100 text-[#822378]' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <GripVertical className="h-4 w-4" />
            <button onClick={() => onFieldToggle(field.id)}>
              <CheckSquare className={`h-4 w-4 ${field.enabled ? 'text-[#822378]' : 'text-gray-400'}`} />
            </button>
            <span>
              {language === 'ar' ? field.labelAr : field.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}