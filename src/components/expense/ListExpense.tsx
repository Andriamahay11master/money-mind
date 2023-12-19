"use client"
import * as React from 'react';
import './listExpense.scss';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
        

interface ListExpenseProps {
    dataList: any
}

export default function ListExpense({dataList} : ListExpenseProps) {

    return (
        <div className='list-expenses-block'>
            <DataTable className='list-expenses-table' value={dataList} sortMode="multiple">
                <Column field="id" header="Réference" sortable></Column>
                <Column field="date" header="Date" sortable></Column>
                <Column field="category" header="Category" sortable></Column>
                <Column field="value" header="Value" sortable></Column>
            </DataTable>
        </div>
    )
}