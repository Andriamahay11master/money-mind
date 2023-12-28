"use client"
import * as React from 'react';
import { useState } from 'react';
import './formCategory.scss';

interface FormCategoryProps {
    labelData : string[]
}

export default function FormCategory({labelData} : FormCategoryProps) {
    return (
        <div className="form-block">
            <h3 className="title-h3">{labelData[0]}</h3>
            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="nameCategoryForm">{labelData[1]}</label>
                    <input type="text" placeholder={labelData[2]} id="nameCategoryForm"/>
                </div>
                <div className="form-group form-submit">
                    <button type="submit" className='btn btn-primary'>{labelData[3]}</button>
                </div>
            </form>
        </div>
    )
}

