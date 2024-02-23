"use client"
import * as React from 'react';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Kpi from '../components/kpi/Kpi';
import {formatDate, formatNumber, removeSpaceStringNumber} from '../data/function';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import ListExpenseFive from '../components/expense/ListExpenseFive';
import ChartExpense from '../components/expense/ChartExpense';



export default function Home() {

  const { t } = useTranslation('translation');
  const balance = '1600000';
  interface ExpenseType {
    idExpenses: number;
    descriptionForm: string;
    dateExpenses: string;
    categoryExpenses: string;
    valueExpenses: string;
  }

  const [expenses, setExpenses] = React.useState(Array<ExpenseType>);
  const [expensesM, setExpensesM] = React.useState(Array<ExpenseType>);


  //List 5 last Expense
  async function getLastFiveExpenses() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense?type=LAST_5`, postData);
    const response = await res.json();
    const expensesArray: ExpenseType[] = Object.values(response.expenses);
    setExpenses(expensesArray);
  }

  //List Expense Month selected
  async function getMonthExpense(valMonth: number) {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense?type=MONTH&valMonth=${valMonth}`, postData);
    const response = await res.json();
    const expensesArray: ExpenseType[] = Object.values(response.expenses);
    setExpensesM(expensesArray);
  }

  //Map the list of Expenses
  const dataList2 = Object.values(expenses).map((expense) => ({
    id: expense["idExpenses"],
    description: expense["descriptionForm"],
    date: formatDate(expense["dateExpenses"]),
    category: expense["categoryExpenses"],
    value: formatNumber(expense["valueExpenses"])
  }))

  const dataListM = Object.values(expensesM).map((expense) => ({
    id: expense["idExpenses"],
    description: expense["descriptionForm"],
    date: formatDate(expense["dateExpenses"]),
    category: expense["categoryExpenses"],
    value: formatNumber(expense["valueExpenses"])
  }))

  //Get the total ammount of the expenses of the month selected
  const sumAmount = dataListM.reduce((acc, expense) => {
    return acc + parseInt(removeSpaceStringNumber(expense["value"]));
  }, 0);

  //Get the rest of the expenses of the month selected
  function getRemainingBalance(balance: string, amount: string) : number{
    return parseInt(removeSpaceStringNumber(balance)) - parseInt(removeSpaceStringNumber(amount));
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

  //data KPI 
  const kpi = [
    {
      title: `${t('kpi.0.title')}`,
      value: formatNumber(balance)
    },
    {
      title: `${t('kpi.1.title')}`,
      value: formatNumber(sumAmount.toString())
    },
    {
      title: `${t('kpi.2.title')}`,
      value: formatNumber(getRemainingBalance(balance, sumAmount.toString()).toString())
    }
  ];

  //data Breadcrumb
  const itemsBreadcrumb = [
    {
      label: `${t('breadcrumb.home')}`,
      path: '/',
    }
  ];

  //data Chart Expense
  const listCategory = [
    `${t('category.0')}`,
    `${t('category.1')}`,
    `${t('category.2')}`,
    `${t('category.3')}`,
    `${t('category.4')}`
  ];

  const listData = [
    10000,
    20000,
    30000,
    40000,
    500000
  ];

  const listColor = [
    '#336699',
    '#0099cc',
    '#D30E3F',
    '#FFD301',
    '#5B5B5B'
  ];

  

  React.useEffect(() => {
    getLastFiveExpenses();
    getMonthExpense(2);
  }, []);

  return (
    <>
      <Header linkMenu={dataNav}/>
      <main className='main-page'>
        <div className="container">
          <Breadcrumb items={itemsBreadcrumb}/>
          <section className="main-section listKpi">
            {kpi.map((item, index) => (
              <Kpi key={index} title={item.title} value={item.value}/>
            ))}
          </section>
          <section className='main-section detailKpi'>
              <div className="detailKpi-item">
                  <h2 className="title-h2 detailKpi-title">{t('detailKpi.title')}</h2>
                  <ListExpenseFive dataList={dataList2}/>
              </div>
              <div className="detailKpi-item">
                  <h2 className="title-h2 detailKpi-title">{t('detailKpi.titleGraphe')}</h2>
                  <ChartExpense listCategory={listCategory} listData={listData} listColor={listColor} listColorHover={listColor}/>
              </div>
          </section>
        </div>
      </main>
      <Footer {...dataFooter}/>
    </>
    
  );
}
