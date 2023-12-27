"use client"
import * as React from "react";
import { useState } from "react";
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './listExpense.scss'

interface ListAllProps {
    dataList: any
}

export default function ListAll({dataList} : ListAllProps) {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        category: { value: null, matchMode: FilterMatchMode.IN }
    });

    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e : any) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    return (
        <div className='list-expenses-block'>
            <div className="list-expenses-block-header">
                <input value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </div>
            <DataTable className='list-expenses-table' paginator rows={10} dataKey="id" value={dataList} sortMode="multiple"
                filters={filters} globalFilterFields={['description', 'date', 'category']}>
                <Column field="id" header="Réference" sortable></Column>
                <Column field="description" header="Description" sortable></Column>
                <Column field="date" header="Date" sortable></Column>
                <Column field="category" header="Category" sortable></Column>
                <Column field="value" header="Value" sortable></Column>
            </DataTable>
        </div>
    )

}