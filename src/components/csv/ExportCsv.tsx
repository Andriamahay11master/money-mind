import { ExpenseType } from '@/src/models/ExpenseType';
import React from 'react';
import { CSVLink } from 'react-csv';

interface ExportCSVProps{
    data: ExpenseType[]
}


const ExportCSV = ({ data } : ExportCSVProps) => {
  const headers = [
    { label: "idexpenses", key: "idexpenses" },
    { label: "description", key: "description" },
    { label: "valueexpenses", key: "valueexpenses" },
    { label: "dateexpenses", key: "dateexpenses" },
    { label: "categoryexpense", key: "categoryexpense" },
    { label: "compte", key: "compte" },
  ];

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={"expenses.csv"}
      className="btn btn-primary"
      target="_blank"
    >
      Export to CSV
    </CSVLink>
  );
};

export default ExportCSV;
