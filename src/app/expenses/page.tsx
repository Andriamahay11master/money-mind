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

  //data ListExpense
  const dataList = [
    {
      id: 1,
      description: 'Course chez Leader',
      date: '2023-12-01',
      category: `${t('category.0')}`,
      value: formatNumber('10000')
    },
    {
      id: 2,
      description: 'Gasoil chez Jovenna',
      date: '2023-12-02',
      category: `${t('category.1')}`,
      value: formatNumber('20000')
    },
    {
      id: 3,
      date: '2023-12-03',
      description: 'Entretien véhicule chez KOMADA',
      category: `${t('category.2')}`,
      value: formatNumber('30000')
    },
    {
      id: 4,
      description: 'Parking easy park',
      date: '2023-12-04',
      category: `${t('category.3')}`,
      value: formatNumber('40000')
    },
    {
      id: 5,
      description: 'Déjeuner chez Tana water front',
      date: '2023-12-05',
      category: `${t('category.4')}`,
      value: formatNumber('500000')
    },
    {
      id: 6,
      description: 'Diné chez Paladios',
      date: '2023-12-05',
      category: `${t('category.4')}`,
      value: formatNumber('500000')
    }
  ];

  const [expenses, setExpenses] = useState([]);
  const [created, setCreated] = useState(false);

  const inputRefDescription = React.useRef<HTMLInputElement>(null);
    const inputRefValue = React.useRef<HTMLInputElement>(null);
    const inputRefCategory = React.useRef<HTMLSelectElement>(null);

  async function getExpenses(){
    const postData = {
      method: "GET",
      headers :{
        "Content-Type": "application/json",
      }
    };
    const res = await fetch(`api/expense`, postData);
    const response = await res.json();
    setExpenses(response.expenses)
  }

  
  const dataList2 = (expenses as ExpenseType[]).map((expense) => ({
    id: expense.idExpenses,
    description: expense.descriptionForm,
    date: expense.dateExpenses,
    category: expense.categoryExpenses,
    value: formatNumber(expense.valueExpenses)
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
    setExpenses(response.expenses)
    setCreated(response.message === "success");
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
                      <ListAll dataList={dataList2}/>
                    </div>
                </div>
            </main>
            <Footer {...dataFooter}/>
        </div>
    )
}