"use client"
import * as React from 'react';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Kpi from '../components/kpi/Kpi';
import {formatNumber, removeSpaceStringNumber} from '../data/function';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import ListExpenseFive from '../components/expense/ListExpenseFive';
import ChartExpense from '../components/expense/ChartExpense';
import Loader from '../components/loader/Loader';
import { monthNames } from '../data/function';
import { useRouter } from 'next/navigation';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ExpenseType } from '../models/ExpenseType';
import { CompteType } from '../models/CompteType';

export default function Home() {

  const { t } = useTranslation('translation');
  const router = useRouter();

  const balance = '25000';

  const [expenses, setExpenses] = React.useState(Array<ExpenseType>);
  const [expensesM, setExpensesM] = React.useState(Array<ExpenseType>);
  const [topCategoryExpenses, setTopCategoryExpenses] = React.useState<Array<[string, number]>>([]);
  const [comptes, setComptes] = React.useState(Array<CompteType>);
  const inputFilterRefCompte = React.useRef<HTMLSelectElement>(null);
  const [counter, setCounter] = React.useState(0);
  const dateTOday = new Date();
  const date = dateTOday.getMonth();
  const defaultCompte = monthNames[date] + " " + dateTOday.getFullYear();
  const [inputFilter, setInputFilter] = React.useState(defaultCompte);
  const [userUID, setUserUID] = React.useState('');
  const [userMail, setUserMail] = React.useState('');

  //List 5 last Expense of compte selected
  async function getLastFiveExpensesCurrent(valAccount: string) {
    try {
      const q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("compte", "==", valAccount), orderBy("idexpenses", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map(doc => {
          const dateTask = new Date(doc.data().dateexpenses.seconds * 1000);
          const dayL = dateTask.toDateString();

          return {
              idexpenses: doc.data().idexpenses,
              compte: doc.data().compte,
              dateexpenses: dayL.toString(),
              categoryexpense: doc.data().categoryexpense,
              uidUser: doc.data().uidUser,
              valueexpenses: doc.data().valueexpenses,
              description: doc.data().description
          }
        });
        setExpenses(newData);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

  //List compte user active
  async function getComptes() {
    try {
      const q = query(collection(db, "compte"), where("uidUser", "==", userUID), orderBy("idcompte", "asc"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map(doc => {
          return {
              idcompte: doc.data().idcompte,
              uidUser: doc.data().uidUser,
              description: doc.data().description
          }
        });
        setComptes(newData);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

  //List 5 last Expense of all compte
  async function getLastFiveExpensesAll() {
    try {
      const q = query(collection(db, "expenses"), where("uidUser", "==", userUID), orderBy("idexpenses", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map(doc => {
          const dateTask = new Date(doc.data().dateexpenses.seconds * 1000);
          const dayL = dateTask.toDateString();

          return {
              idexpenses: doc.data().idexpenses,
              compte: doc.data().compte,
              dateexpenses: dayL.toString(),
              categoryexpense: doc.data().categoryexpense,
              uidUser: doc.data().uidUser,
              valueexpenses: doc.data().valueexpenses,
              description: doc.data().description
          }
        });
        setExpenses(newData);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

  //List Expense Month selected
  async function getMonthExpense(valMonth: string) {
    try {
      const q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("compte", "==", valMonth), orderBy("idexpenses", "asc"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map(doc => {
          const dateTask = new Date(doc.data().dateexpenses.seconds * 1000);
          const dayL = dateTask.toDateString();

          return {
              idexpenses: doc.data().idexpenses,
              compte: doc.data().compte,
              dateexpenses: dayL.toString(),
              categoryexpense: doc.data().categoryexpense,
              uidUser: doc.data().uidUser,
              valueexpenses: doc.data().valueexpenses,
              description: doc.data().description
          }
        });
          setExpensesM(newData);
      } catch (error) {
          console.error("Error fetching documents: ", error);
      }
  }

  //Get all expense by default
  async function getAllExpenses() {
    try {
      const q = query(collection(db, "expenses"), where("uidUser", "==", userUID), orderBy("idexpenses", "asc"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map(doc => {
          const dateTask = new Date(doc.data().dateexpenses.seconds * 1000);
          const dayL = dateTask.toDateString();

          return {
              idexpenses: doc.data().idexpenses,
              compte: doc.data().compte,
              dateexpenses: dayL.toString(),
              categoryexpense: doc.data().categoryexpense,
              uidUser: doc.data().uidUser,
              valueexpenses: doc.data().valueexpenses,
              description: doc.data().description
          }
        });
        setExpensesM(newData);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

  //List Sum of Expenses by category for all compte
  async function getTopExpenseCategories() {
    try {
      const q = query(collection(db, "expenses"), where("uidUser", "==", userUID), orderBy("idexpenses", "asc"));
      const querySnapshot = await getDocs(q);

      let categoryTotals: Record<string, number> = {};

      querySnapshot.forEach(doc => {
        const category = doc.data().categoryexpense;
        const value = doc.data().valueexpenses;
        if(categoryTotals[category]) {
          categoryTotals[category] += value;
        } else {
          categoryTotals[category] = value;
        }
      });    

      // Convertir l'objet en tableau de paires (catégorie, total)
      const categoryTotalsArray = Object.entries(categoryTotals);

      // Trier le tableau par valeur (total dépensé) dans l'ordre décroissant
      categoryTotalsArray.sort((a, b) => b[1] - a[1]);

       // Sélectionner les 5 premières catégories (les plus dépensées)
      const topCategories = categoryTotalsArray.slice(0, 5);
      
      setTopCategoryExpenses(topCategories);
      return topCategories;
      } catch (error) {
          console.error("Error fetching documents: ", error);
      }
  }

  //List Sum Expense by category by chosen Compte
  async function getTopExpenseCategoriesCurrent(valAccount: string) {
    try {
      const q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("compte", "==", valAccount), orderBy("idexpenses", "asc"));
      const querySnapshot = await getDocs(q);

      let categoryTotals: Record<string, number> = {};

      querySnapshot.forEach(doc => {
        const category = doc.data().categoryexpense;
        const value = doc.data().valueexpenses;
        if(categoryTotals[category]) {
          categoryTotals[category] += value;
        } else {
          categoryTotals[category] = value;
        }
      });    

      // Convertir l'objet en tableau de paires (catégorie, total)
      const categoryTotalsArray = Object.entries(categoryTotals);
      // Trier le tableau par valeur (total dépensé) dans l'ordre décroissant
      categoryTotalsArray.sort((a, b) => b[1] - a[1]);

       // Sélectionner les 5 premières catégories (les plus dépensées)
      const topCategories = categoryTotalsArray.slice(0, 5);
      
      setTopCategoryExpenses(topCategories);
      return topCategories;
      } catch (error) {
          console.error("Error fetching documents: ", error);
      }
  }

  //List oOp Expenses categories
  const dataListTC = Object.values(topCategoryExpenses).map((expense) => ({
    name: expense[0],
    value: expense[1]
  }))

  //Get the total ammount of the expenses of the month selected
  const sumAmount = expensesM.reduce((acc, expense) => {
    return acc + expense.valueexpenses;
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
      title: inputFilter === 'ALL' ? `${t('kpi.nbCompte')}` : `${t('kpi.0.title')}`,
      value: inputFilter === 'ALL' ? `${comptes.length}` : formatNumber(balance),
      currency: inputFilter === 'ALL' ? '' : 'ruppes'
    },
    {
      title: `${t('kpi.1.title')}`,
      value: sumAmount ? formatNumber(sumAmount.toString()) : '0',
      currency: 'ruppes'
    },
    {
      title: `${t('kpi.2.title')}`,
      value: sumAmount ? formatNumber(getRemainingBalance(balance, sumAmount.toString()).toString()) : formatNumber(balance),
      currency: 'ruppes'
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
  const listCategory = Object.values(dataListTC).map((item) => (item['name']))

  const listData = Object.values(dataListTC).map((item) => (item['value']))

  const listColor = [
    '#336699',
    '#4169E1',
    '#800080',
    '#FFD301',
    '#5B5B5B'
  ];

  //filter action function
  const handleFilterCompteChange = () => {
    const selectedDesc = inputFilterRefCompte.current?.value;
    setInputFilter(selectedDesc?.toString() ?? 'ALL');
    setCounter(counter + 1);
    
    if(inputFilter === 'ALL'){
      getLastFiveExpensesAll();
      getTopExpenseCategories();
      getAllExpenses();
    }
    else{
      getLastFiveExpensesCurrent(inputFilter);
      getTopExpenseCategoriesCurrent(inputFilter);
      getMonthExpense(inputFilter);
    }
  };

  React.useEffect(() => {
    getComptes();
    if(inputFilter === 'ALL'){
      getLastFiveExpensesAll();
      getTopExpenseCategories();
      getAllExpenses();
    }
    else{
      getLastFiveExpensesCurrent(inputFilter);
      getTopExpenseCategoriesCurrent(inputFilter);
      getMonthExpense(inputFilter);
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        const uid = user.uid
        setUserMail(email ?? '');
        setUserUID(uid ?? '');
      } else {
        router.push("/login");
      }
    });
  }, [inputFilterRefCompte.current, inputFilter]);

  return (
    <>
    {(userMail !== '')  ? (
      <>
      <Header linkMenu={dataNav} userMail={userMail}/>
      <main className='main-page'>
        <div className="container">
          <div className="main-page-top">
            <Breadcrumb items={itemsBreadcrumb}/>
            <div className="choice-compte">
              <select name="filter-compte" id="filter-compte" ref={inputFilterRefCompte} onChange={handleFilterCompteChange} value={inputFilter}>
                {comptes.map((compte, index) => (
                  <option key={index} value={compte.description}>{compte.description}</option>
                ))}
                <option value="ALL">Tous</option>
              </select>   
            </div>
          </div>
          <section className="main-section listKpi">
            {kpi.map((item, index) => (
              <Kpi key={index} title={item.title} value={item.value} currency={item.currency}/>
            ))}
          </section>
          <section className='main-section detailKpi'>
              <div className="detailKpi-item">
                  <h2 className="title-h2 detailKpi-title">{t('detailKpi.titleGraphe')}</h2>
                  {<ChartExpense listCategory={listCategory} listData={listData} listColor={listColor} listColorHover={listColor}/>}
              </div>
              <div className="detailKpi-item">
                  <h2 className="title-h2 detailKpi-title">{t('detailKpi.title')}</h2>
                  <ListExpenseFive dataList={expenses}/>
              </div>
          </section>
        </div>
      </main>
      <Footer {...dataFooter}/>
      </>
    ) : (
      <Loader/>
    )}
    </>
  );
}


Home.requireAuth = true
