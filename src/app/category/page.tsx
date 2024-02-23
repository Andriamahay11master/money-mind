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
        idCategory: number;
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
        } ,
        {
            name: `${t('menu.projects')}`,
            href: '/statistics'
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
        `${t('formCategory.save')}`
    ]

    const [categories, setCategory] = useState(Array<CategoryType>);
    const [created, setCreated] = useState(false);

    const inputRefDescription = React.useRef<HTMLInputElement>(null);

    const dataList = Object.values(categories).map((category) => ({
        idCategory: category["idCategory"],
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
        const res = await fetch(`api/category`, postData);
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

    async function getCategories() {
        const offset = (currentPage - 1) * itemsPerPage;
        const postData = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        };
        const res = await fetch(`api/category?offset=${offset}&limit=${itemsPerPage}`, postData);
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
                        <FormCategory labelData={labelData} inputRefDescription={inputRefDescription} saveCategory={addCategories}/>
                        {created && <div className="alert alert-success">{t('message.insertedCategorySuccess')}</div> }
                    </div>
                    <div className="main-section">
                        <div className="list-block list-expense">
                            <table className='list-table'>
                            <thead>
                                <tr>
                                    <th>{t('table.id')}</th>
                                    <th>{t('table.description')}</th>
                                </tr>
                            </thead>
                            <tbody>
                            {dataList.slice(startIndex, endIndex).map((list, index) => (
                                <tr key={index}>
                                    <td>{list.idCategory}</td>
                                    <td>{list.description}</td>
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