"use client"
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import './chartExpense.scss';

interface ChartExpenseProps {
    listCategory : string[]
    listData : number[]
    listColor : string[]
    listColorHover : string[]
}
export default function ChartExpense({listCategory, listData, listColor} : ChartExpenseProps) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const data = {
            labels: listCategory,
            datasets: [
                {
                    data: listData,
                    backgroundColor: listColor,
                    hoverBackgroundColor: listColor.map(color => color.replace('0.7', '1'))
                }
            ]
        }
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <div className="chart-expense-block">
            <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
        </div>
    )
}
        