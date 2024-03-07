"use client"
import Header from '@/src/components/header/Header';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import './page.scss'
import * as React from 'react';
import Footer from '@/src/components/footer/Footer';
import Breadcrumb from '@/src/components/breadcrumb/Breadcrumb';
import { formatNumber } from '@/src/data/function';
import FormCategory from '@/src/components/category/FormCategory';
import ListCategory from '@/src/components/category/ListCategory';
import { useEffect, useState, useRef } from 'react';

export default function Category(){
    const { t } = useTranslation('translation');

    //interface CategoryType
    interface CategoryType {
        idcategory: number;
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
        label: `${t('breadcrumb.category')}`,
        path: '/category',
        }
    ];

    //dataFOrm
    const labelData = [
        `${t('formCategory.title')}`,
        `${t('formCategory.description')}`,
        `${t('formCategory.placeholder')}`,
        `${t('formCategory.placeholderUpdate')}`,
        `${t('formCategory.save')}`,
        `${t('formCategory.update')}`
    ]

    const [categories, setCategory] = useState(Array<CategoryType>);
    const [stateForm, setStateForm] = useState(true);
    const [idUpdateCategory, setIdUpdateCategory] = useState(0);
    const [created, setCreated] = useState(false);
    const [updated, setUpdated] = useState(false);

    const inputRefDescription = React.useRef<HTMLInputElement>(null);

    const dataList = Object.values(categories).map((category) => ({
        idcategory: category["idcategory"],
        description: category["description"]
    }));

    async function addCategories() {
        const postData = {
          method: "POST",
          headers :{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: inputRefDescription.current?.value,
          })
        };
        const res = await fetch(`/api/addCategory?description=${inputRefDescription.current?.value}`, postData);
        const response = await res.json();
        //Update list category
        setCategory(response.categories);
    
    
        // Reset form by updating refs to initial values
        if (inputRefDescription.current) inputRefDescription.current.value = "";
    
        // Now, fetch the updated categories
        getCategories();
        
        setCreated(true);
    
        setTimeout(() => {
          setCreated(false);
        }, 1400)
      }

      async function updateCategory(){
        const postData = {
          method: "PUT",
          headers :{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idcategory: idUpdateCategory,
            description: inputRefDescription.current?.value,
          })
        };
        const res = await fetch(`/api/updateCategory?idcategory=${idUpdateCategory}&description=${inputRefDescription.current?.value}`, postData);
        const response = await res.json();
        //Update list category
        setCategory(response.categories);
        // Reset form by updating refs to initial values
        if (inputRefDescription.current) inputRefDescription.current.value = "";
        // Now, fetch the updated categories
        getCategories();
                
        setUpdated(true);

        setTimeout(() => {
            setUpdated(false);
        }, 1400)
      }

    async function getCategories() {
        const postData = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        };
        const res = await fetch(`api/category`, postData);
        const response = await res.json();
        const categoriesArray: CategoryType[] = Object.values(response.categories);
        setCategory(categoriesArray);
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    //pagination control
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const handlePageChange = (newPage : any) => {
        setCurrentPage(newPage);
    };

    //send the id category to formCategory for update
    const callUpdateForm = (idcategory: number) => {
        const category = categories.find((category) => category.idcategory === idcategory);
        if (category) {
            inputRefDescription.current!.value = category.description;
        }
        setIdUpdateCategory(idcategory);
        setStateForm(false);
    }


    useEffect(() => {
        getCategories();
      }, []);

    return (
        <div>
            <Header linkMenu={dataNav}/>
            <main className='main-page'>
                <div className="container">
                    <Breadcrumb items={itemsBreadcrumb}/>
                    <div className="main-section section-form">
                        <FormCategory labelData={labelData} inputRefDescription={inputRefDescription} stateInsert={stateForm} actionBDD={stateForm ? addCategories : updateCategory} />
                        {created && <div className="alert alert-success">{t('message.insertedCategorySuccess')}</div> }
                        {updated && <div className="alert alert-success">{t('message.updatedCategorySuccess')}</div> }
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
                                    <td>{list.idcategory}</td>
                                    <td>{list.description}</td>
                                    <td><div className="action-box"><button type="button" className="btn btn-icon" onClick={() => callUpdateForm(list.idcategory)}><i className="icon-pencil"></i></button> <button className="btn btn-icon"><i className="icon-bin2"></i></button></div></td>
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