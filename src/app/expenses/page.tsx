"use client"
import Header from '@/src/components/header/Header';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import './page.scss'
import * as React from 'react';
import Footer from '@/src/components/footer/Footer';
import Breadcrumb from '@/src/components/breadcrumb/Breadcrumb';
import FormExpense from '@/src/components/expense/FormExpense';
import { formatNumber, formatDate } from '@/src/data/function';
import { useEffect, useState, useRef } from 'react';
import { log } from 'console';

export default function Expenses() {
    const { t } = useTranslation('translation');

    interface ExpenseType {
      idExpenses: number;
      descriptionForm: string;
      dateExpenses: string;
      categoryExpenses: string;
      valueExpenses: number;
      idCompte: number;
      compteDescription: string;
    }

    interface CategoryType {
      idCategory: number;
      description: string;
    }

    interface CompteType {
      idCompte: number;
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
      label: `${t('breadcrumb.expenses')}`,
      path: '/expenses',
    }
  ];

  //data Form
  const labelData = [
    `${t('form.title')}`,
    `${t('form.description')}`,
    `${t('form.value')}`,
    `${t('form.date')}`,
    `${t('form.category')}`,
    `${t('form.compte')}`,
    `${t('form.save')}`
  ]

  const placeholderInput = [
    `${t('placeholder.0')}`,
    `${t('placeholder.1')}`,
    `${t('placeholder.2')}`,
  ]

  const [expenses, setExpenses] = useState(Array<ExpenseType>);
  const [categories, setCategory] = useState(Array<CategoryType>);
  const [comptes, setCompte] = useState(Array<CompteType>);
  const [comptesI, setCompteI] = useState(Array<CompteType>);
  const [created, setCreated] = useState(false);

  const inputRefDescription = React.useRef<HTMLInputElement>(null);
    const inputRefValue = React.useRef<HTMLInputElement>(null);
    const inputRefCategory = React.useRef<HTMLSelectElement>(null);
    const inputRefDate = React.useRef<HTMLInputElement>(null);
    const inputRefCompte = React.useRef<HTMLSelectElement>(null);
    const inputFilterRefCompte = React.useRef<HTMLSelectElement>(null);
 
  const dataList2 = Object.values(expenses).map((expense) => ({
    idExpenses: expense["idExpenses"],
    descriptionForm: expense["descriptionForm"],
    dateExpenses: formatDate(expense["dateExpenses"]),
    categoryExpenses: expense["categoryExpenses"],
    valueExpenses: expense["valueExpenses"],
    compteDescrition: expense["compteDescription"]
  }))

  const dataCategory = Object.values(categories).map((category) => (
    category.description
  ))

  const dataCompte = Object.values(comptes).map((compte) => (
    compte.description
  ))

  const dataCOmpteI = Object.values(comptesI).map((compte) => (
    compte.idCompte
  ))

  const handleCompteChange = () => {
    const selectedDesc = inputRefCompte.current?.value || '';
    getIDCOmpteBYDesc(selectedDesc);
  };

  
  
  async function addExpenses() {

    const postData = {
      method: "POST",
      headers :{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descriptionForm: inputRefDescription.current?.value,
        valueExpenses: inputRefValue.current?.value,
        dateExpenses: inputRefDate.current?.value,  
        categoryExpenses: inputRefCategory.current?.value,
        idCompte: dataCOmpteI ? dataCOmpteI[0] : 1
      })
    };
    const res = await fetch(`api/expense`, postData);
    const response = await res.json();
    //Update list expense
    setExpenses(response.expenses);


    // Reset form by updating refs to initial values
    if (inputRefDescription.current) inputRefDescription.current.value = "";
    if (inputRefValue.current) inputRefValue.current.value = "";
    if (inputRefDate.current) inputRefDate.current.value = "";
    if (inputRefCategory.current) inputRefCategory.current.value = dataCategory[0];
    if (inputRefCompte.current) {
      const postData2 = {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
      };
      inputRefCompte.current.value = dataCompte[0];
      const encodedDesc = encodeURIComponent(inputRefCompte.current.value);
      const res1 = await fetch(`api/compte?type=UNIQUE&desc=${encodedDesc}`, postData2);
      const response1 = await res1.json();
      const compteArray1: CompteType[] = Object.values(response1.comptes);
      setCompteI(compteArray1);
    }

    // Now, fetch the updated expenses
    getExpenses();
    
    setCreated(true);

    setTimeout(() => {
      setCreated(false);
    }, 1400)
  }

  async function getExpenses() {
    const offset = (currentPage - 1) * itemsPerPage;
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense?offset=${offset}&limit=${itemsPerPage}`, postData);
    const response = await res.json();
    const expensesArray: ExpenseType[] = Object.values(response.expenses);
    setExpenses(expensesArray);
  }

  async function getIDCOmpteBYDesc(desc: string) {
    const encodedDesc = encodeURIComponent(desc);
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/compte?type=UNIQUE&desc=${encodedDesc}`, postData);
    const response = await res.json();
    const compteArray: CompteType[] = Object.values(response.comptes);
    setCompteI(compteArray);
    console.log(compteArray);
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

//Compte courant
async function getExpensesCurrent(valAccount: string) {
  const offset = (currentPage - 1) * itemsPerPage;
  const postData = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetch(`api/expense?type=ACCOUNT&valAccount=${valAccount}&offset=${offset}&limit=${itemsPerPage}`, postData);
  const response = await res.json();
  const expensesArray: ExpenseType[] = Object.values(response.expenses);
  setExpenses(expensesArray);
  console.log('liste expenses', expensesArray)
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
  const totalPages = Math.ceil(expenses.length / itemsPerPage);

  const handlePageChange = (newPage : any) => {
    setCurrentPage(newPage);
  };

  const handleFilterCompteChange = () => {
    const selectedDesc = inputFilterRefCompte.current?.value || '';
    if(selectedDesc === 'ALL'){
      getExpenses();
    }
    else{
      getExpensesCurrent(selectedDesc);
    }
  };

  console.log(inputFilterRefCompte.current?.value);
  useEffect(() => {
    getExpenses();
    getCategories();
    getComptes();
    if (inputRefCompte.current) {
      inputRefCompte.current.addEventListener('change', handleCompteChange);
      return () => {
        inputRefCompte.current?.removeEventListener('change', handleCompteChange);
      };
    }
    
  }, [inputRefCompte.current, inputFilterRefCompte.current]);
  
    return (
        <div>
            <Header linkMenu={dataNav}/>
            <main className='main-page'>
                <div className="container">
                    <Breadcrumb items={itemsBreadcrumb}/>
                    <div className="main-section section-form">
                      <FormExpense labelData={labelData} dataCategory={dataCategory} dataCompte={dataCompte} placeholderInput={placeholderInput} inputRefDescription={inputRefDescription} inputRefDateValue={inputRefDate} inputRefValue={inputRefValue} inputRefCategory={inputRefCategory} inputRefCompte={inputRefCompte} saveExpense={addExpenses}/>
                      {created && <div className="alert alert-success">{t('message.insertedExpenseSuccess')}</div> }
                    </div>
                    <div className="main-section">
                      <div className="table-filter">
                        <select name="filter-compte" id="filter-compte" ref={inputFilterRefCompte} onChange={handleFilterCompteChange}>
                          {comptes.map((compte, index) => (
                            <option key={index} value={compte.description}>{compte.description}</option>
                          ))}
                          <option value="ALL">Tous</option>
                        </select>   
                      </div>
                      <div className="list-block list-view">
                        <table className='list-table'>
                          <thead>
                            <tr>
                              <th>{t('table.id')}</th>
                              <th>{t('table.description')}</th>
                              <th>{t('table.value')} (en Ariary)</th>
                              <th>{t('table.date')}</th>
                              <th>{t('table.category')}</th>
                              <th>{t('table.compte')}</th>
                            </tr>
                          </thead>
                          <tbody>
                          {dataList2.slice(startIndex, endIndex).map((list, index) => (
                            <tr key={index}>
                                <td>{list.idExpenses}</td>
                                <td>{list.descriptionForm}</td>
                                <td>{list.valueExpenses ? formatNumber(list.valueExpenses.toString()) + ' Ar' : 'N/A'}</td>
                                <td>{list.dateExpenses}</td>
                                <td>{list.categoryExpenses}</td>
                                <td>{list.compteDescrition}</td>
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