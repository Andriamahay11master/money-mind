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
import Loader from '@/src/components/loader/Loader';

export default function Expenses() {
    const { t } = useTranslation('translation');

    interface ExpenseType {
      idexpenses: number;
      descriptionform: string;
      dateexpenses: string;
      categoryexpenses: string;
      valueexpenses: number;
      idcompte: number;
      comptedescription: string;
    }

    interface CategoryType {
      idCategory: number;
      description: string;
    }

    interface CompteType {
      idcompte: number;
      description: string;
    }

    //state pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7; // Choose the number of items to display per page


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
    `${t('form.save')}`,
    `${t('form.update')}`
  ]

  const placeholderInput = [
    `${t('placeholder.0')}`,
    `${t('placeholder.1')}`,
    `${t('placeholder.2')}`,
  ]

  const [isLoading, setIsLoading] = React.useState(true);
  const [expenses, setExpenses] = useState(Array<ExpenseType>);
  const [categories, setCategory] = useState(Array<CategoryType>);
  const [comptes, setCompte] = useState(Array<CompteType>);
  const [comptesI, setCompteI] = useState(Array<CompteType>);
  const [stateForm, setStateForm] = useState(true);
  const [idUpdateExpenses, setIdUpdateExpenses] = useState(0);
  const [created, setCreated] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const inputRefDescription = React.useRef<HTMLInputElement>(null);
    const inputRefValue = React.useRef<HTMLInputElement>(null);
    const inputRefCategory = React.useRef<HTMLSelectElement>(null);
    const inputRefDate = React.useRef<HTMLInputElement>(null);
    const inputRefCompte = React.useRef<HTMLSelectElement>(null);
    const inputFilterRefCompte = React.useRef<HTMLSelectElement>(null);
 
  const dataList2 = Object.values(expenses).map((expense) => ({
    idexpenses: expense["idexpenses"],
    descriptionform: expense["descriptionform"],
    dateexpenses: formatDate(expense["dateexpenses"]),
    categoryexpenses: expense["categoryexpenses"],
    valueexpenses: expense["valueexpenses"],
    comptedescription: expense["comptedescription"]
  }))

  const dataCategory = Object.values(categories).map((category) => (
    category.description
  ))

  const dataCompte = Object.values(comptes).map((compte) => (
    compte.description
  ))

  const dataCompteID = Object.values(comptes).map((compte) => (
    compte.idcompte
  ))

  async function addExpenses() {

    const postData = {
      method: "POST",
      headers :{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descriptionform: inputRefDescription.current?.value,
        valueexpenses: inputRefValue.current?.value,
        dateexpenses: inputRefDate.current?.value,  
        categoryexpenses: inputRefCategory.current?.value,
        idcompte: inputRefCompte.current?.value
      })
    };
    console.log(inputRefCompte.current?.value)
    console.log(postData)
    const res = await fetch(`api/addExpense?desce=${inputRefDescription.current?.value}&valuee=${inputRefValue.current?.value}&datee=${inputRefDate.current?.value}&categorye=${inputRefCategory.current?.value}&accountide=${inputRefCompte.current?.value}`, postData);
    const response = await res.json();
    //Update list expense
    setExpenses(response.expenses); 


    // Reset form by updating refs to initial values
    if (inputRefDescription.current) inputRefDescription.current.value = "";
    if (inputRefValue.current) inputRefValue.current.value = "";
    if (inputRefDate.current) inputRefDate.current.value = "";
    if (inputRefCategory.current) inputRefCategory.current.value = dataCategory[0];
    if (inputRefCompte.current) inputRefCompte.current.value = dataCompteID[0].toString();
    // Now, fetch the updated expenses
    getExpenses();
    
    setCreated(true);

    setTimeout(() => {
      setCreated(false);
    }, 1400)
  }

  async function updateExpenses() {
    const postData = {
      method: "PUT",
      headers :{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idexpenses: idUpdateExpenses,
        descriptionform: inputRefDescription.current?.value,
        valueexpenses: inputRefValue.current?.value,
        dateexpenses: inputRefDate.current?.value,
        categoryexpenses: inputRefCategory.current?.value,
        idcompte: inputRefCompte.current?.value
      })
    };
    const res = await fetch(`/api/updateExpense?ide=${idUpdateExpenses}&desce=${inputRefDescription.current?.value}&valuee=${inputRefValue.current?.value}&datee=${inputRefDate.current?.value}&categorye=${inputRefCategory.current?.value}&accountide=${inputRefCompte.current?.value}`, postData);
    const response = await res.json();
    //Update list expense
    setExpenses(response.expenses); 
    // Reset form by updating refs to initial values
    if (inputRefDescription.current) inputRefDescription.current.value = "";
    if (inputRefValue.current) inputRefValue.current.value = "";
    if (inputRefDate.current) inputRefDate.current.value = "";
    if (inputRefCategory.current) inputRefCategory.current.value = dataCategory[0];
    if (inputRefCompte.current) inputRefCompte.current.value = dataCompteID[0].toString();

    // Now, fetch the updated expenses
    getExpenses();
    
    setUpdated(true);

    setTimeout(() => {
      setUpdated(false);
      setStateForm(true);
    }, 1400)

  }
  async function getExpenses() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense`, postData);
    const response = await res.json();
    const expensesArray: ExpenseType[] = Object.values(response.expenses);
    setExpenses(expensesArray);
  }

  //delete expense
  async function deleteExpense(id: number) {
    const postData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idexpense: id
      })
    };
    const res = await fetch("/api/deleteExpense?idexpense=" + id + "", postData);
    const response = await res.json();
    setExpenses(response.expenses);
    getExpenses();
    setDeleted(true);
    setTimeout(() => {
      setDeleted(false);
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

//Compte courant
async function getExpensesCurrent(valAccount: string) {
  const postData = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const res = await fetch(`api/expense?type=ACCOUNT&valAccount=${valAccount}`, postData);
  const response = await res.json();
  const expensesArray: ExpenseType[] = Object.values(response.expenses);
  setExpenses(expensesArray);
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
    setCurrentPage(1);
    if(selectedDesc === 'ALL'){
      getExpenses();
    }
    else{
      getExpensesCurrent(selectedDesc);
    }
  };

  const callUpdateForm = (idexpense: number) => {
    const expense = expenses.find((expense) => expense.idexpenses === idexpense);
    if (expense) {
      const originalDate = new Date(expense.dateexpenses);
      const newDate = new Date(originalDate);
      newDate.setDate(originalDate.getDate() + 1);
      const numString = expense.valueexpenses.toString();

      inputRefDescription.current!.value = expense.descriptionform;
      inputRefValue.current!.value = numString;
      inputRefDate.current!.value = newDate.toISOString().slice(0, 10);
      inputRefCategory.current!.value = expense.categoryexpenses;
      inputRefCompte.current!.value = expense.idcompte.toString();
    }
    setIdUpdateExpenses(idexpense);
    setStateForm(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      getExpenses();
      getCategories();
      getComptes();
      setIsLoading(false);
    };

    fetchData();
    
  }, [inputRefCompte.current, inputFilterRefCompte.current]);
  
    if(isLoading){
      return <Loader/>
    }

    return (
        <div>
            <Header linkMenu={dataNav}/>
            <main className='main-page'>
                <div className="container">
                    <Breadcrumb items={itemsBreadcrumb}/>
                    <div className="main-section page-form-2">
                      <div className="section-form">
                        <FormExpense labelData={labelData} dataCategory={dataCategory} dataCompte={dataCompte} placeholderInput={placeholderInput} inputRefDescription={inputRefDescription} inputRefDateValue={inputRefDate} inputRefValue={inputRefValue} inputRefCategory={inputRefCategory} inputRefCompte={inputRefCompte} stateForm={stateForm} actionBDD={stateForm ? addExpenses : updateExpenses}/>
                        {created && <div className="alert alert-success">{t('message.insertedExpenseSuccess')}</div> }
                        {updated && <div className="alert alert-success">{t('message.updatedExpenseSuccess')}</div> }
                        {deleted && <div className="alert alert-danger">{t('message.deletedExpenseSuccess')}</div> }
                      </div>
                      <div className="section-list">
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
                                <th>{t('table.action')}</th>
                              </tr>
                            </thead>
                            <tbody>
                            {dataList2 && dataList2.slice(startIndex, endIndex).map((list, index) => (
                              <tr key={index}>
                                  <td>{list.idexpenses}</td>
                                  <td>{list.descriptionform}</td>
                                  <td>{list.valueexpenses ? formatNumber(list.valueexpenses.toString()) + ' Ar' : 'N/A'}</td>
                                  <td>{list.dateexpenses}</td>
                                  <td>{list.categoryexpenses}</td>
                                  <td>{list.comptedescription}</td>
                                  <td><div className="action-box"><button type="button" className='btn btn-icon' onClick={() => callUpdateForm(list.idexpenses)}><i className="icon-pencil"></i></button> <button className="btn btn-icon" onClick={() => deleteExpense(list.idexpenses)}><i className="icon-bin2"></i></button></div></td>
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
                </div>
            </main>
            <Footer {...dataFooter}/>
        </div>
    )
}