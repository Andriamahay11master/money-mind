import { CompteType } from '@/src/models/CompteType';
import React from 'react';
import { CSVLink } from 'react-csv';

interface ExportCSVProps{
    data: CompteType[]
}


const ExportCsvCompte = ({ data } : ExportCSVProps) => {
  const headers = [
    { label: "idcompte", key: "idcompte" },
    { label: "description", key: "description" },
  ];

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={"comptes.csv"}
      className="btn btn-primary"
      target="_blank"
    >
      Export to CSV
    </CSVLink>
  );
};

export default ExportCsvCompte;
