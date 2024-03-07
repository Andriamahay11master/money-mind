"use client"
import * as React from 'react';
import { useState } from 'react';
import "./formExpense.scss";
import {formatNumber} from '@/src/data/function';

interface FormExpenseProps {
    labelData : string[]
    dataCategory : string[]
    dataCompte : string[]
    placeholderInput : string[]
    inputRefDescription : React.RefObject<HTMLInputElement>
    inputRefValue : React.RefObject<HTMLInputElement>
    inputRefDateValue : React.RefObject<HTMLInputElement>
    inputRefCategory : React.RefObject<HTMLSelectElement>
    inputRefCompte : React.RefObject<HTMLSelectElement>
    stateForm : boolean
    actionBDD : () => void
}
export default function FormExpense({labelData, dataCategory, dataCompte, placeholderInput, inputRefDescription, inputRefDateValue, inputRefValue, inputRefCategory, inputRefCompte , stateForm, actionBDD} : FormExpenseProps) {
    
    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
      // Remove non-numeric characters and spaces
      const numericValue = e.currentTarget.value.replace(/[^\d]/g, '');

    // Set the numeric value to the input field
    inputRefValue.current!.value = numericValue;

    return numericValue;
    };
    

    const handleactionBDD = () => {
        // Pass the values to the actionBDD function
        actionBDD();
    };

    
    return (
        <div className="form-block">
            <h3 className="title-h3">{labelData[0]}</h3>

            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="descriptionForm">{labelData[1]}</label>
                    <input type="text" placeholder={placeholderInput[0]} id="descriptionForm" ref={inputRefDescription}/>
                </div>
                <div className="form-group">
                    <label htmlFor="valueForm">{labelData[2]}</label>
                    <input type="text" placeholder={placeholderInput[1]} id="valueForm" onChange={handleInputChange} ref={inputRefValue}/>
                </div>
                <div className="form-group">
                    <label htmlFor="dateForm">{labelData[3]}</label>
                    <input type="date" placeholder={placeholderInput[2]} id="dateForm" ref={inputRefDateValue}/>
                </div>
                <div className="form-group">
                    <label htmlFor="categoryForm">{labelData[4]}</label>
                    <select name="categoryForm" id="categoryForm" ref={inputRefCategory}>
                        {dataCategory.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="compteForm">{labelData[5]}</label>
                    <select name="compteForm" id="compteForm" ref={inputRefCompte}>
                        {dataCompte.map((compte, index) => (
                            <option key={index} value={index+1}>{compte}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={() => handleactionBDD()}>{stateForm ? labelData[6] : labelData[7]}</button>
                </div>
            </form>
        </div>
    )
}