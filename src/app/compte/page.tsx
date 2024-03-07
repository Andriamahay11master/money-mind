"use client"
import Header from '@/src/components/header/Header';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import './page.scss'
import * as React from 'react';
import Footer from '@/src/components/footer/Footer';
import Breadcrumb from '@/src/components/breadcrumb/Breadcrumb';
import { formatNumber } from '@/src/data/function';
import FormCompte from '@/src/components/compte/FormCompte';
import { useEffect, useState, useRef } from 'react';
import { sql } from "@vercel/postgres";

export default function Compte(){
    const { t } = useTranslation('translation');

    //interface CompteType
    interface CompteType {
        idcompte: number;
        description: string;
      }

      //state pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Choose the number of items to display per page

    //Data Nav
    const dataNav = [
        {
            name: `${t('menu.home')}`,
            href: '/'   
        },  
        {
            name: `${t('menu.about')}`,
            href: '/expenses'
        }, 
        {
            name: `${t('menu.compte')}`,
            href: '/compte'
        },
        {
            name: `${t('menu.contact')}`,
            href: '/category'
        }
      ];

    //data footer
    const dataFooter = {
        title: `${t('footer.title')}`,
        desc: `${t('footer.desc')}`,
        copyright: `${t('footer.copyright')}`,
    }

    //data Breadcrumb
    const itemsBreadcrumb = [
        {
        label: `${t('breadcrumb.home')}`,
        path: '/',
        },
        {
        label: `${t('breadcrumb.compte')}`,
        path: '/compte',
        }
    ];

    //dataFOrm
    const labelData = [
        `${t('formCompte.title')}`,
        `${t('formCompte.description')}`,
        `${t('formCompte.placeholder')}`,
        `${t('formCompte.placeholderUpdate')}`,
        `${t('formCompte.save')}`,
        `${t('formCompte.update')}`
    ]

    const [comptes, setCompte] = useState(Array<CompteType>);
    const [stateForm, setStateForm] = useState(true);
    const [idUpdateCompte, setIdUpdateCompte] = useState(0);
    const [created, setCreated] = useState(false);
    const [updated, setUpdated] = useState(false);

    const inputRefDescription = React.useRef<HTMLInputElement>(null);

    const dataList = Object.values(comptes).map((compte) => ({
        idcompte: compte["idcompte"],
        description: compte["description"]
    }));

    async function addComptes() {
        const postData = {
          method: "POST",
          headers :{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: inputRefDescription.current?.value,
          })
        };
        const res = await fetch(`api/addCompte?desc=${inputRefDescription.current?.value}`, postData);
        const response = await res.json();
        setCompte(response.comptes);
    
    
        // Reset form by updating refs to initial values
        if (inputRefDescription.current) inputRefDescription.current.value = "";
    
        // Now, fetch the updated comptes
        getComptes();
        
        setCreated(true);
    
        setTimeout(() => {
          setCreated(false);
        }, 1400)
      }

    async function updateCompte() {
        const postData = {
          method: "PUT",
          headers :{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idcompte: idUpdateCompte,
            description: inputRefDescription.current?.value,
          })
        };
        const res = await fetch(`/api/updateCompte?idcompte=${idUpdateCompte}&description=${inputRefDescription.current?.value}`, postData);
        const response = await res.json();
        setCompte(response.comptes);
        // Reset form by updating refs to initial values
        if (inputRefDescription.current) inputRefDescription.current.value = "";
    
        // Now, fetch the updated comptes
        getComptes();
        
        setUpdated(true);
    
        setTimeout(() => {
            setUpdated(false);
            setStateForm(true);
        }, 1400)
    }

    async function getComptes() {
        const offset = (currentPage - 1) * itemsPerPage;
        const postData = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        };
        const res = await fetch(`api/compte?offset=${offset}&limit=${itemsPerPage}`, postData);
        const response = await res.json();
        const comptesArray: CompteType[] = Object.values(response.comptes);
        setCompte(comptesArray);
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    //pagination control
    const totalPages = Math.ceil(comptes.length / itemsPerPage);

    const handlePageChange = (newPage : any) => {
        setCurrentPage(newPage);
    };

    const callUpdateForm = (idcompte: number) => {
        const compte = comptes.find((compte) => compte.idcompte === idcompte);
        if (compte) {
            inputRefDescription.current!.value = compte.description;
        }
        setIdUpdateCompte(idcompte);
        setStateForm(false);
    }

    useEffect(() => {
        getComptes();
      }, []);

    return (
        <div>
            <Header linkMenu={dataNav}/>
            <main className='main-page'>
                <div className="container">
                    <Breadcrumb items={itemsBreadcrumb}/>
                    <div className="main-section section-form">
                        <FormCompte labelData={labelData} inputRefDescription={inputRefDescription} stateForm={stateForm} actionBDD={stateForm ? addComptes : updateCompte}/>
                        {created && <div className="alert alert-success">{t('message.insertedCompteSuccess')}</div> }
                        {updated && <div className="alert alert-success">{t('message.updatedCompteSuccess')}</div> }
                    </div>
                    <div className="main-section">
                        <div className="list-block list-view">
                            <table className='list-table'>
                            <thead>
                                <tr>
                                    <th>{t('table.id')}</th>
                                    <th>{t('table.description')}</th>
                                    <th>{t('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                            {dataList && dataList.slice(startIndex, endIndex).map((list, index) => (
                                <tr key={index}>
                                    <td>{list.idcompte}</td>
                                    <td>{list.description}</td>
                                    <td><div className="action-box"><button type="button" className='btn btn-icon' onClick={() => callUpdateForm(list.idcompte)}><i className="icon-pencil"></i></button> <button className="btn btn-icon"><i className="icon-bin2"></i></button></div></td>
                                </tr>
                            ))}
                            </tbody>
                            </table>
                        </div>
                        <div className="pagination-table">
                          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={page === currentPage ? "active" : ""}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer {...dataFooter}/>
        </div>    
    )
}