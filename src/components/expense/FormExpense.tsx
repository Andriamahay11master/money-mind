"use client"
import * as React from 'react';
import { useState } from 'react';
import "./formExpense.scss";
import {formatNumber} from '@/src/data/function';

interface FormExpenseProps {
    labelData : string[]
    dataCategory : string[]
    placeholderInput : string[]
}
export default function FormExpense({labelData, dataCategory, placeholderInput} : FormExpenseProps) {
    const [formattedValue, setFormattedValue] = useState('');

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
      // Remove non-numeric characters and spaces
      const inputValue = e.currentTarget.value.replace(/[^\d]/g, '');
  
      // Format the number and update the state
      setFormattedValue(formatNumber(inputValue));
    };

    return (
        <div className="form-expense-block">
            <h3 className="title-h3">{labelData[0]}</h3>

            <form action="" className='form-expense'>
                <div className="form-group">
                    <label htmlFor="descriptionForm">{labelData[1]}</label>
                    <input type="text" placeholder={placeholderInput[0]} id="descriptionForm"/>
                </div>
                <div className="form-group">
                    <label htmlFor="valueForm">{labelData[2]}</label>
                    <input type="text" placeholder={placeholderInput[1]} id="valueForm" value={formattedValue} onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="dateForm">{labelData[3]}</label>
                    <input type="date" placeholder={placeholderInput[2]} id="dateForm"/>
                </div>
                <div className="form-group">
                    <label htmlFor="categoryForm">{labelData[4]}</label>
                    <select name="categoryForm" id="categoryForm">
                        {dataCategory.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group form-submit">
                    <button type="submit" className='btn btn-primary'>{labelData[5]}</button>
                </div>
            </form>
        </div>
    )
}