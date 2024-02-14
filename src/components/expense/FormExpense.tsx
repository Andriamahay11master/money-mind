"use client"
import * as React from 'react';
import { useState } from 'react';
import "./formExpense.scss";
import {formatNumber} from '@/src/data/function';

interface FormExpenseProps {
    labelData : string[]
    dataCategory : string[]
    placeholderInput : string[]
    inputRefDescription : React.RefObject<HTMLInputElement>
    inputRefValue : React.RefObject<HTMLInputElement>
    inputRefCategory : React.RefObject<HTMLSelectElement>
    saveExpense : (description : string, value : string, category : string) => void
}
export default function FormExpense({labelData, dataCategory, placeholderInput, inputRefDescription, inputRefValue, inputRefCategory ,saveExpense} : FormExpenseProps) {
    const [formattedValue, setFormattedValue] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
      // Remove non-numeric characters and spaces
      const inputValue = e.currentTarget.value.replace(/[^\d]/g, '');
  
      // Format the number and update the state
      setFormattedValue(formatNumber(inputValue));
    };
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.currentTarget.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.currentTarget.value);
    };
    
    const handleSaveExpense = () => {
        // Pass the values to the saveExpense function
        saveExpense(description, formattedValue, category);

        // Reset the state after saving
        setDescription('');
        setFormattedValue('');
        setCategory('');
    };

    
    return (
        <div className="form-block">
            <h3 className="title-h3">{labelData[0]}</h3>

            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="descriptionForm">{labelData[1]}</label>
                    <input type="text" placeholder={placeholderInput[0]} id="descriptionForm" onChange={handleDescriptionChange} ref={inputRefDescription}/>
                </div>
                <div className="form-group">
                    <label htmlFor="valueForm">{labelData[2]}</label>
                    <input type="text" placeholder={placeholderInput[1]} id="valueForm" value={formattedValue} onChange={handleInputChange} ref={inputRefValue}/>
                </div>
                <div className="form-group">
                    <label htmlFor="categoryForm">{labelData[4]}</label>
                    <select name="categoryForm" id="categoryForm" onChange={handleCategoryChange} ref={inputRefCategory}>
                        {dataCategory.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={() => handleSaveExpense()}>{labelData[5]}</button>
                </div>
            </form>
        </div>
    )
}