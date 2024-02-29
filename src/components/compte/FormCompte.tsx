"use client"
import * as React from 'react';
import './formCompte.scss';

interface FormCompteProps {
    labelData : string[],
    inputRefDescription : React.RefObject<HTMLInputElement>
    saveCompte: () => void
}

export default function FormCompte({labelData, inputRefDescription, saveCompte} : FormCompteProps) {
    
    return (
        <div className="form-block">
            <h3 className="title-h3">{labelData[0]}</h3>
            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="nameCompteForm">{labelData[1]}</label>
                    <input type="text" placeholder={labelData[2]} id="nameCompteForm" ref={inputRefDescription}/>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={saveCompte}>{labelData[3]}</button>
                </div>
            </form>
        </div>
    )
}

