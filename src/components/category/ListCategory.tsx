"use client"
import * as React from "react";
import { useState } from "react";
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './listCategory.scss'

interface ListCategoryProps {
    dataList: any
}

export default function ListCategory({dataList} : ListCategoryProps) {

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        category: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
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
        <div className='list-block'>
            <div className="list-block-header">
                <input value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </div>
            <DataTable className='list-table' paginator rows={10} dataKey="id" value={dataList} sortMode="multiple"
                filters={filters} globalFilterFields={['category']}>
                <Column field="id" header="Réference" sortable></Column>
                <Column field="category" header="Category" sortable></Column>
            </DataTable>
        </div>
    )

}