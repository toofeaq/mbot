import React, { useState, useEffect } from 'react';
import { Calendar, X, Download } from 'lucide-react';
import type { LogoConfig } from '../App';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ProjectDetailsForm from './ProjectDetailsForm';
import FieldSettings from './FieldSettings';
import AttendanceTable from './AttendanceTable';

interface Field {
  id: string;
  name: string;
  label: string;
  labelAr: string;
  enabled: boolean;
  order: number;
  isCustom?: boolean;
}

interface AttendanceSheetProps {
  names: Array<{ arabic: string; english: string }>;
  logos: LogoConfig[];
  projectTitle: string;
}

interface ProjectDetails {
  activityTitle: {
    arabic: string;
    english: string;
  };
  subActivityTitle: {
    arabic: string;
    english: string;
  };
  location: {
    arabic: string;
    english: string;
  };
  startDate: string;
  endDate: string;
  language: 'ar' | 'en';
}

export default function AttendanceSheet({
  names,
  logos,
  projectTitle
}: AttendanceSheetProps) {
  const [fields, setFields] = useState<Field[]>([
    { id: 'number', name: 'number', label: 'No.', labelAr: 'الرقم', enabled: true, order: 0 },
    { id: 'code', name: 'code', label: 'Code', labelAr: 'الرمز', enabled: false, order: 1 },
    { id: 'name', name: 'name', label: 'Name', labelAr: 'الاسم', enabled: true, order: 2 },
    { id: 'workplace', name: 'workplace', label: 'Workplace', labelAr: 'جهة العمل', enabled: true, order: 3 },
    { id: 'residence', name: 'residence', label: 'Current Residence', labelAr: 'السكن الحالي', enabled: true, order: 4 },
    { id: 'idCheck', name: 'idCheck', label: 'ID Check', labelAr: 'هل وافق على تصوير هوية الخدمة', enabled: true, order: 5 }
  ]);

  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    activityTitle: {
      arabic: 'تنظيم ورش عمل تبادلية تجمع بين أعضاء البنى التحتية للسلام والسلطات والجهات الفاعلة الأخرى',
      english: 'Organize exchange workshops that bring together members of peace infrastructures, authorities and other actors'
    },
    subActivityTitle: {
      arabic: 'ورشة عمل ختامية',
      english: 'Closing Event Workshop'
    },
    location: {
      arabic: 'فندق المنصور ميليا - بغداد',
      english: 'Al-Mansour Melia Hotel - Baghdad'
    },
    startDate: '2024-07-27',
    endDate: '2024-07-28',
    language: 'ar'
  });

  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [signatureDays, setSignatureDays] = useState(1);
  const [emptyRows, setEmptyRows] = useState(0);
  const [draggedField, setDraggedField] = useState<Field | null>(null);

  useEffect(() => {
    const start = new Date(projectDetails.startDate);
    const end = new Date(projectDetails.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setSignatureDays(diffDays);
  }, [projectDetails.startDate, projectDetails.endDate]);

  const handleProjectDetailChange = (field: string, value: any) => {
    setProjectDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleField = (fieldId: string) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, enabled: !field.enabled } : field
    ));
  };

  const addCustomField = () => {
    const newField: Field = {
      id: `custom-${Date.now()}`,
      name: `custom-${Date.now()}`,
      label: 'New Field',
      labelAr: 'حقل جديد',
      enabled: true,
      order: fields.length,
      isCustom: true
    };
    setFields([...fields, newField]);
  };

  const handleFieldDragStart = (field: Field) => {
    setDraggedField(field);
  };

  const handleFieldDragOver = (e: React.DragEvent, targetField: Field) => {
    e.preventDefault();
    if (!draggedField || draggedField.id === targetField.id) return;

    const newFields = [...fields];
    const draggedIndex = newFields.findIndex(f => f.id === draggedField.id);
    const targetIndex = newFields.findIndex(f => f.id === targetField.id);

    newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, draggedField);

    newFields.forEach((field, index) => {
      field.order = index;
    });

    setFields(newFields);
  };

  const handleFieldDragEnd = () => {
    setDraggedField(null);
  };

  const exportToPDF = async () => {
    const content = document.getElementById('attendance-sheet');
    if (!content) return;

    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height, '', 'FAST');
    pdf.save('attendance-sheet.pdf');
  };

  const totalRows = names.length + (emptyRows || 0);
  const rows = Array.from({ length: totalRows }, (_, index) => ({
    number: index + 1,
    name: names[index] || { arabic: '', english: '' }
  }));

  return (
    <div className="space-y-6 bg-white rounded-lg shadow p-6">
      {/* Header Logos */}
      <div className="flex justify-between items-center mb-6">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.url}
            alt={`Logo ${index + 1}`}
            className="h-12 object-contain"
            style={{
              order: logo.alignment === 'right' ? 1 : -1
            }}
          />
        ))}
      </div>

      {/* Project Details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#822378]">
            {projectDetails.language === 'ar' ? 'تفاصيل المشروع' : 'Project Details'}
          </h2>
          <div className="flex items-center space-x-4">
            <select
              value={projectDetails.language}
              onChange={(e) => handleProjectDetailChange('language', e.target.value as 'ar' | 'en')}
              className="p-2 border rounded-md"
            >
              <option value="ar">عربي</option>
              <option value="en">English</option>
            </select>
            <button
              onClick={() => setShowProjectDetails(!showProjectDetails)}
              className="text-[#822378] hover:text-purple-700"
            >
              {showProjectDetails ? <X className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {showProjectDetails && (
          <ProjectDetailsForm
            projectDetails={projectDetails}
            onProjectDetailsChange={handleProjectDetailChange}
            emptyRows={emptyRows}
            onEmptyRowsChange={setEmptyRows}
            onClose={() => setShowProjectDetails(false)}
          />
        )}
      </div>

      {/* Field Settings */}
      <FieldSettings
        fields={fields}
        language={projectDetails.language}
        onFieldToggle={toggleField}
        onFieldDragStart={handleFieldDragStart}
        onFieldDragOver={handleFieldDragOver}
        onFieldDragEnd={handleFieldDragEnd}
        onAddCustomField={addCustomField}
      />

      {/* Export Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportToPDF}
          className="flex items-center px-4 py-2 bg-[#822378] text-white rounded-md hover:bg-purple-700"
        >
          <Download className="h-4 w-4 mr-2" />
          {projectDetails.language === 'ar' ? 'تصدير PDF' : 'Export PDF'}
        </button>
      </div>

      {/* Attendance Table */}
      <AttendanceTable
        fields={fields}
        rows={rows}
        signatureDays={signatureDays}
      />
    </div>
  );
}