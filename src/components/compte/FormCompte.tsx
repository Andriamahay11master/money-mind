"use client"
import * as React from 'react';
import './formCompte.scss';

interface FormCompteProps {
    labelData : string[],
    inputRefDescription : React.RefObject<HTMLInputElement>,
    stateForm: boolean,
    actionBDD: () => void
}

export default function FormCompte({labelData, inputRefDescription, stateForm, actionBDD} : FormCompteProps) {
    
    return (
        <div className="form-block">
            <h3 className="title-h3">{labelData[0]}</h3>
            <form action="" className='form-content'>
                <div className="form-group">
                    <label htmlFor="nameCompteForm">{labelData[1]}</label>
                    <input type="text" placeholder={stateForm ? labelData[2] : labelData[3]} id="nameCompteForm" ref={inputRefDescription}/>
                </div>
                <div className="form-group form-submit">
                    <button type="button" className='btn btn-primary' onClick={actionBDD}>{stateForm ? labelData[4] : labelData[5]}</button>
                </div>
            </form>
        </div>
    )
}

