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
    const maxHeight = 200;

    const [tooltipIndex, setTooltipIndex] = React.useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        setTooltipIndex(index);
    };

    const handleMouseLeave = () => {
        setTooltipIndex(null);
    };
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
                        <div key={index} className="chart-item wrapper" style={{height: calculatedHeight + 'px', backgroundColor: listColor[index]}} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                        {calculatedHeight > 50 ? <p className='chart-item-text'>{formatNumber(item.toString())} Ariary</p> : null} 
                        {tooltipIndex === index && (
                            <div className="tooltip">
                                <p>{formatNumber(item.toString())} Ariary</p>
                            </div>
                        )}
                    </div>
                    )
                }
                )}
            </div>
        </div>
    )
}
        