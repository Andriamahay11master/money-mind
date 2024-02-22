"use client"
import Header from '@/src/components/header/Header';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import './page.scss'
import * as React from 'react';
import Footer from '@/src/components/footer/Footer';
import Breadcrumb from '@/src/components/breadcrumb/Breadcrumb';
import FormExpense from '@/src/components/expense/FormExpense';
import ListAll from '@/src/components/expense/ListAll';
import { formatNumber } from '@/src/data/function';
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

    interface ExpenseProp{
      description: string
      formattedValue: string
      category: string
    }
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

  const dataCategory = [
    `${t('category.0')}`,
    `${t('category.1')}`,
    `${t('category.2')}`,
    `${t('category.3')}`,
    `${t('category.4')}`,
  ]

  const placeholderInput = [
    `${t('placeholder.0')}`,
    `${t('placeholder.1')}`,
    `${t('placeholder.2')}`,
  ]

  const [expenses, setExpenses] = useState(Array<ExpenseType>);
  const [created, setCreated] = useState(false);

  const inputRefDescription = React.useRef<HTMLInputElement>(null);
    const inputRefValue = React.useRef<HTMLInputElement>(null);
    const inputRefCategory = React.useRef<HTMLSelectElement>(null);
 
  const dataList2 = Object.values(expenses).map((expense) => ({
    idExpenses: expense["idExpenses"],
    descriptionForm: expense["descriptionForm"],
    dateExpenses: expense["dateExpenses"],
    categoryExpenses: expense["categoryExpenses"],
    valueExpenses: formatNumber(expense["valueExpenses"])
  }))

  async function addExpenses() {
    const postData = {
      method: "POST",
      headers :{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descriptionForm: inputRefDescription.current?.value,
        valueExpenses: inputRefValue.current?.value,
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
    if (inputRefCategory.current) inputRefCategory.current.value = "";

    // Now, fetch the updated expenses
    getExpenses();
    
    setCreated(true);

    console.log("val created"+created)
  }

  async function getExpenses(){
    const postData = {
      method: "GET",
      headers :{
        "Content-Type": "application/json",
      }
    };
    const res = await fetch(`api/expense`, postData);
    const response = await res.json();
    const expensesArray : ExpenseType[] = Object.values(response.expenses);
    setExpenses(expensesArray);
  }

  useEffect(() => {
    getExpenses();
  }, []);
  
    return (
        <div>
            <Header linkMenu={dataNav}/>
            <main className='main-page'>
                <div className="container">
                    <Breadcrumb items={itemsBreadcrumb}/>
                    <div className="main-section section-form">
                      <FormExpense labelData={labelData} dataCategory={dataCategory} placeholderInput={placeholderInput} inputRefDescription={inputRefDescription} inputRefValue={inputRefValue} inputRefCategory={inputRefCategory} saveExpense={addExpenses}/>
                      {created && <div className="alert alert-success">Expense added</div> }
                    </div>
                    <div className="main-section">
                      {/* <ListAll dataList={dataList2}/> */}
                      <table>
                        {dataList2.map((list, index) => (
                          <tr key={index}>
                            <td>{list.idExpenses}</td>
                            <td>{list.descriptionForm}</td>
                            <td>{list.valueExpenses}</td>
                            <td>{list.dateExpenses}</td>
                            <td>{list.categoryExpenses}</td>
                          </tr>
                        ))}
                      </table>
                    </div>
                </div>
            </main>
            <Footer {...dataFooter}/>
        </div>
    )
}