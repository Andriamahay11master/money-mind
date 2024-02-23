"use client"
import * as React from 'react';
import { useState } from 'react';
import './formCategory.scss';

interface FormCategoryProps {
    labelData : string[],
    inputRefDescription : React.RefObject<HTMLInputElement>
    saveCategory: (descripion : string) => void
}

export default function FormCategory({labelData, inputRefDescription, saveCategory} : FormCategoryProps) {
    
    const [description, setDescription] = useState('');

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.currentTarget.value);
    };

    const handleSaveCategory = () => {
        // Pass the values to the saveExpense function
        saveCategory(description);

        // Reset the state after saving
        setDescription('');
    };
    return (
        <div className="form-block">
            <h3 className="title-h3">{labelData[0]}</h3>
            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="nameCategoryForm">{labelData[1]}</label>
                    <input type="text" placeholder={labelData[2]} id="nameCategoryForm" ref={inputRefDescription} onChange={handleDescriptionChange}/>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={handleSaveCategory}>{labelData[3]}</button>
                </div>
            </form>
        </div>
    )
}

