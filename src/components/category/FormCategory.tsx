"use client"
import * as React from 'react';
import './formCategory.scss';

interface FormCategoryProps {
    labelData : string[],
    inputRefDescription : React.RefObject<HTMLInputElement>,
    stateInsert: boolean,
    actionBDD: () => void
}

export default function FormCategory({labelData, inputRefDescription, stateInsert, actionBDD } : FormCategoryProps) {
    
    return (
        <div className="form-block">
            <h3 className="title-h3">{labelData[0]}</h3>
            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="nameCategoryForm">{labelData[1]}</label>
                    <input type="text" placeholder={stateInsert ? labelData[2] : labelData[3]} id="nameCategoryForm" ref={inputRefDescription}/>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={actionBDD}>{stateInsert ? labelData[4] : labelData[5]}</button>
                </div>
            </form>
        </div>
    )
}

