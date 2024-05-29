import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExpenseType } from '@/src/models/ExpenseType';
import { CompteType } from '@/src/models/CompteType';
import { CategoryType } from '@/src/models/CategoryType';

interface ExportExcelProps{
  data: ExpenseType[] | CompteType[] | CategoryType[],
  nameSheet: string,
  nameFile: string
}
const ExportExcel = ({ data, nameSheet, nameFile } : ExportExcelProps) => {
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, nameSheet);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${nameFile}.xlsx`);
  };

  return (
    <button onClick={exportToExcel} className="btn btn-primary">
      Export to Excel
    </button>
  );
};

export default ExportExcel;
