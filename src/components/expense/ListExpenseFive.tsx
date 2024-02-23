"use client"
import * as React from 'react';
import './listExpense.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        

interface ListExpenseFiveProps {
    dataList: any
}

export default function ListExpenseFive({dataList} : ListExpenseFiveProps) {

    return (
        <div className='list-block'>
            <DataTable className='list-table' stripedRows value={dataList} sortMode="multiple">
                <Column field="id" header="Réference" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column field="date" header="Date" sortable></Column>
                <Column field="category" header="Category" sortable></Column>
                <Column field="value" header="Value" sortable></Column>
            </DataTable>
        </div>
    )
}