import * as React from 'react';
import './kpi.scss';

interface KpiProps{
    title : string,
    value : number | string
    currency ?: string
}

export default function Kpi({title, value, currency} : KpiProps) {

    return (
       <div className="kpi-item">
            <div className="kpi-col">
                <h3 className="title-h3 kpi-title">{title}</h3>
            </div>
            <div className="kpi-col">
                <p className='kpi-text'>{value} {currency && <span>{currency}</span>}</p>
            </div>
       </div>
    )
}