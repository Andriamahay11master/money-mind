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

export default function Expenses() {
    const { t } = useTranslation('translation');

    interface ExpenseType {
      idExpenses: number;
      descriptionForm: string;
      dateExpenses: string;
      categoryExpenses: string;
      valueExpenses: string;
    }

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
    `${t('form.save')}`
  ]

  const placeholderInput = [
    `${t('placeholder.0')}`,
    `${t('placeholder.1')}`,
    `${t('placeholder.2')}`,
  ]

  const [expenses, setExpenses] = useState(Array<ExpenseType>);
  const [categories, setCategory] = useState(Array<CategoryType>);
  const [created, setCreated] = useState(false);

  const inputRefDescription = React.useRef<HTMLInputElement>(null);
    const inputRefValue = React.useRef<HTMLInputElement>(null);
    const inputRefCategory = React.useRef<HTMLSelectElement>(null);
    const inputRefDate = React.useRef<HTMLInputElement>(null);
 
  const dataList2 = Object.values(expenses).map((expense) => ({
    idExpenses: expense["idExpenses"],
    descriptionForm: expense["descriptionForm"],
    dateExpenses: formatDate(expense["dateExpenses"]),
    categoryExpenses: expense["categoryExpenses"],
    valueExpenses: formatNumber(expense["valueExpenses"])
  }))

  const dataCategory = Object.values(categories).map((category) => (
    category.description
  ))

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

  useEffect(() => {
    getExpenses();
    getCategories();
  }, []);
  
    return (
        <div>
            <Header linkMenu={dataNav}/>
            <main className='main-page'>
                <div className="container">
                    <Breadcrumb items={itemsBreadcrumb}/>
                    <div className="main-section section-form">
                      <FormExpense labelData={labelData} dataCategory={dataCategory} placeholderInput={placeholderInput} inputRefDescription={inputRefDescription} inputRefDateValue={inputRefDate} inputRefValue={inputRefValue} inputRefCategory={inputRefCategory} saveExpense={addExpenses}/>
                      {created && <div className="alert alert-success">{t('message.insertedExpenseSuccess')}</div> }
                    </div>
                    <div className="main-section">
                      <div className="list-block list-expense">
                        <table className='list-table'>
                          <thead>
                            <tr>
                              <th>{t('table.id')}</th>
                              <th>{t('table.description')}</th>
                              <th>{t('table.value')} (en Ariary)</th>
                              <th>{t('table.date')}</th>
                              <th>{t('table.category')}</th>
                            </tr>
                          </thead>
                          <tbody>
                          {dataList2.slice(startIndex, endIndex).map((list, index) => (
                            <tr key={index}>
                              <td>{list.idExpenses}</td>
                              <td>{list.descriptionForm}</td>
                              <td>{list.valueExpenses} Ar</td>
                              <td>{list.dateExpenses}</td>
                              <td>{list.categoryExpenses}</td>
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