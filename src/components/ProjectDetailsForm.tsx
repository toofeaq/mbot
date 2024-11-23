import React from 'react';
import { X, Calendar } from 'lucide-react';

interface ProjectDetailsFormProps {
  projectDetails: {
    activityTitle: { arabic: string; english: string };
    subActivityTitle: { arabic: string; english: string };
    location: { arabic: string; english: string };
    startDate: string;
    endDate: string;
    language: 'ar' | 'en';
  };
  onProjectDetailsChange: (field: string, value: any) => void;
  emptyRows: number;
  onEmptyRowsChange: (value: number) => void;
  onClose: () => void;
}

export default function ProjectDetailsForm({
  projectDetails,
  onProjectDetailsChange,
  emptyRows,
  onEmptyRowsChange,
  onClose
}: ProjectDetailsFormProps) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-[#822378] mb-2">
          {projectDetails.language === 'ar' ? 'عنوان النشاط' : 'Activity Title'}
        </label>
        <input
          type="text"
          value={projectDetails.activityTitle[projectDetails.language]}
          onChange={(e) => onProjectDetailsChange('activityTitle', {
            ...projectDetails.activityTitle,
            [projectDetails.language]: e.target.value
          })}
          className="w-full p-2 border rounded-md"
          dir={projectDetails.language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#822378] mb-2">
          {projectDetails.language === 'ar' ? 'العنوان الفرعي للنشاط' : 'Sub Activity Title'}
        </label>
        <input
          type="text"
          value={projectDetails.subActivityTitle[projectDetails.language]}
          onChange={(e) => onProjectDetailsChange('subActivityTitle', {
            ...projectDetails.subActivityTitle,
            [projectDetails.language]: e.target.value
          })}
          className="w-full p-2 border rounded-md"
          dir={projectDetails.language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#822378] mb-2">
          {projectDetails.language === 'ar' ? 'الموقع' : 'Location'}
        </label>
        <input
          type="text"
          value={projectDetails.location[projectDetails.language]}
          onChange={(e) => onProjectDetailsChange('location', {
            ...projectDetails.location,
            [projectDetails.language]: e.target.value
          })}
          className="w-full p-2 border rounded-md"
          dir={projectDetails.language === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#822378] mb-2">
            {projectDetails.language === 'ar' ? 'تاريخ البدء' : 'Start Date'}
          </label>
          <input
            type="date"
            value={projectDetails.startDate}
            onChange={(e) => onProjectDetailsChange('startDate', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#822378] mb-2">
            {projectDetails.language === 'ar' ? 'تاريخ الانتهاء' : 'End Date'}
          </label>
          <input
            type="date"
            value={projectDetails.endDate}
            onChange={(e) => onProjectDetailsChange('endDate', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#822378] mb-2">
          {projectDetails.language === 'ar' ? 'عدد الصفوف الفارغة' : 'Empty Rows'}
        </label>
        <input
          type="number"
          value={emptyRows}
          onChange={(e) => onEmptyRowsChange(parseInt(e.target.value) || 0)}
          min="0"
          className="w-full p-2 border rounded-md"
        />
      </div>
    </div>
  );
}