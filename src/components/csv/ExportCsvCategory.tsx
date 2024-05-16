import { CategoryType } from '@/src/models/CategoryType';
import React from 'react';
import { CSVLink } from 'react-csv';

interface ExportCSVProps{
    data: CategoryType[]
}


const ExportCsvCategory = ({ data } : ExportCSVProps) => {
  const headers = [
    { label: "id", key: "id" },
    { label: "description", key: "description" },
  ];

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={"category.csv"}
      className="btn btn-primary"
      target="_blank"
    >
      Export to CSV
    </CSVLink>
  );
};

export default ExportCsvCategory;
