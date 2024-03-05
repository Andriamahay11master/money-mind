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
    valueExpenses: number;
  }

  interface TopExpenseCatType{
    categoryExpenses: string;
    totalExpenses: number;
  }

  interface CompteType {
    idCompte: number;
    description: string;
  }

  const [expenses, setExpenses] = React.useState(Array<ExpenseType>);
  const [expensesM, setExpensesM] = React.useState(Array<ExpenseType>);
  const [expensesTC, setExpensesTC] = React.useState(Array<TopExpenseCatType>);
  const [comptes, setComptes] = React.useState(Array<CompteType>);
  const inputFilterRefCompte = React.useRef<HTMLSelectElement>(null);
  const [counter, setCounter] = React.useState(0);


  //List 5 last Expense
  async function getLastFiveExpensesCurrent(valAccount: string) {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense?type=LAST_5&valAccount=${valAccount}`, postData);
    const response = await res.json();
    const expensesArray: ExpenseType[] = Object.values(response.expenses);
    setExpenses(expensesArray);
  }

  async function getComptes() {
    const postData = {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    };
    const res = await fetch(`api/compte`, postData);
    const response = await res.json();
    const comptesArray: CompteType[] = Object.values(response.comptes);
    setComptes(comptesArray);
}

  async function getLastFiveExpensesAll() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense?type=LAST_5_ALL`, postData);
    const response = await res.json();
    const expensesArray: ExpenseType[] = Object.values(response.expenses);
    setExpenses(expensesArray);
  }

  //List Expense Month selected
  async function getMonthExpense(valMonth: string) {
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

  // All expense 
  async function getMonthExpenseDefault() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense`, postData);
    const response = await res.json();
    const expensesArray: ExpenseType[] = Object.values(response.expenses);
    setExpensesM(expensesArray);
  }

  //List Sum Expense by category all compte
  async function getTopExpenseCategories() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense?type=CATEGORY`, postData);
    const response = await res.json();
    const expensesArray: TopExpenseCatType[] = Object.values(response.expenses);
    setExpensesTC(expensesArray);
  }

  //List Sum Expense by category by chosen Compte
  async function getTopExpenseCategoriesCurrent(valAccount: string) {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(`api/expense?type=CATEGORY_CURRENT&valAccount=${valAccount}`, postData);
    const response = await res.json();
    const expensesArray: TopExpenseCatType[] = Object.values(response.expenses);
    setExpensesTC(expensesArray);
  }

  //Map the list of Expenses
  const dataList2 = Object.values(expenses).map((expense) => ({
    id: expense["idExpenses"],
    description: expense["descriptionForm"],
    date: formatDate(expense["dateExpenses"]),
    category: expense["categoryExpenses"],
    value: expense["valueExpenses"]
  }))

  const dataListM = Object.values(expensesM).map((expense) => ({
    id: expense["idExpenses"],
    description: expense["descriptionForm"],
    date: formatDate(expense["dateExpenses"]),
    category: expense["categoryExpenses"],
    value: expense["valueExpenses"]
  }))

  //List TOp Expenses categories
  const dataListTC = Object.values(expensesTC).map((expense) => ({
    categoryExpenses: expense["categoryExpenses"],
    totalExpenses: expense["totalExpenses"]
  }))

  //Get the total ammount of the expenses of the month selected
  const sumAmount = dataListM.reduce((acc, expense) => {
    return acc + expense["value"];
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

  //data KPI 
  const kpi = [
    {
      title: inputFilterRefCompte.current?.value === 'ALL' ? `${t('kpi.nbCompte')}` : `${t('kpi.0.title')}`,
      value: inputFilterRefCompte.current?.value === 'ALL' ? `${comptes.length}` : formatNumber(balance),
      currency: inputFilterRefCompte.current?.value === 'ALL' ? '' : 'Ariary'
    },
    {
      title: `${t('kpi.1.title')}`,
      value: sumAmount ? formatNumber(sumAmount.toString()) : '0',
      currency: 'Ariary'
    },
    {
      title: `${t('kpi.2.title')}`,
      value: sumAmount ? formatNumber(getRemainingBalance(balance, sumAmount.toString()).toString()) : formatNumber(balance),
      currency: 'Ariary'
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
  const listCategory = Object.values(dataListTC).map((item) => (item['categoryExpenses']))

  const listData = Object.values(dataListTC).map((item) => (item['totalExpenses']))

  const listColor = [
    '#336699',
    '#0099cc',
    '#D30E3F',
    '#FFD301',
    '#5B5B5B'
  ];

  const handleFilterCompteChange = () => {
    const selectedDesc = inputFilterRefCompte.current?.value || '';
    setCounter(counter + 1);
    if(selectedDesc === 'ALL'){
      getLastFiveExpensesAll();
      getTopExpenseCategories();
      getMonthExpenseDefault();
    }
    else{
      getLastFiveExpensesCurrent(selectedDesc);
      getTopExpenseCategoriesCurrent(selectedDesc);
      getMonthExpense(selectedDesc);
    }
  };

  React.useEffect(() => {
    getLastFiveExpensesAll();
    getTopExpenseCategories();
    getMonthExpenseDefault();
    getComptes();
  }, [inputFilterRefCompte.current]);

  return (
    <>
      <Header linkMenu={dataNav}/>
      <main className='main-page'>
        <div className="container">
          <Breadcrumb items={itemsBreadcrumb}/>
          <div className="choice-compte">
            <select name="filter-compte" id="filter-compte" ref={inputFilterRefCompte} onChange={handleFilterCompteChange}>
              {comptes.map((compte, index) => (
                <option key={index} value={compte.description}>{compte.description}</option>
              ))}
              <option value="ALL">Tous</option>
            </select>   
          </div>
          <section className="main-section listKpi">
            {kpi.map((item, index) => (
              <Kpi key={index} title={item.title} value={item.value} currency={item.currency}/>
            ))}
          </section>
          <section className='main-section detailKpi'>
              <div className="detailKpi-item">
                  <h2 className="title-h2 detailKpi-title">{t('detailKpi.title')}</h2>
                  <ListExpenseFive dataList={dataList2}/>
              </div>
              <div className="detailKpi-item">
                  <h2 className="title-h2 detailKpi-title">{t('detailKpi.titleGraphe')}</h2>
                  {(listCategory && listData) && <ChartExpense listCategory={listCategory} listData={listData} listColor={listColor} listColorHover={listColor}/>}
              </div>
          </section>
        </div>
      </main>
      <Footer {...dataFooter}/>
    </>
    
  );
}
