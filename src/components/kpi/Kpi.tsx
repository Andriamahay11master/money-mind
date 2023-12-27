import * as React from 'react';
import './kpi.scss';

interface KpiProps{
    title : string,
    value : number | string
}

export default function Kpi({title, value} : KpiProps) {

    return (
       <div className="kpi-item">
            <div className="kpi-col">
                <h3 className="title-h3 kpi-title">{title}</h3>
            </div>
            <div className="kpi-col">
                <p className='kpi-text'>{value} <span>ariary</span></p>
            </div>
       </div>
    )
}