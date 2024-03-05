"use client"
import React from 'react';
import './chartExpense.scss';
import {formatNumber} from '../../data/function';

interface ChartExpenseProps {
    listCategory : string[]
    listData : number[]
    listColor : string[]
    listColorHover : string[]
}
export default function ChartExpense({listCategory, listData, listColor} : ChartExpenseProps) {
    const maxHeight = 300;
    return (
        <div className="chart-expense-block">
            <div className="chart-legend">
                {listCategory.map((item, index) => (
                    <div key={index} className="chart-legend-item">
                        <span className='chart-legend-color' style={{backgroundColor: listColor[index]}}></span>
                        <p>{item}</p>
                    </div>
                ))}
            </div>
            <div className="chart-list">
                {listData.map((item, index) => {
                    const percentageHeight = (item / Math.max(...listData)) * 100;
                    const calculatedHeight = (percentageHeight / 100) * maxHeight;
                    return (
                        <div key={index} className="chart-item" style={{height: calculatedHeight + 'px', backgroundColor: listColor[index]}}>
                        <p>{formatNumber(item.toString())} Ariary</p>
                    </div>
                    )
                }
                )}
            </div>
        </div>
    )
}
        