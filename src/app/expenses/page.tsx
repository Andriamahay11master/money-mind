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
import {monthNames} from '@/src/data/function';
import { redirect, useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { Timestamp, addDoc, collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { ExpenseType } from '@/src/models/ExpenseType'; 
import { CategoryType } from '@/src/models/CategoryType';
import { CompteType } from '@/src/models/CompteType';

export default function Expenses() {
    const { t } = useTranslation('translation');
    const router = useRouter();

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
  
  const [expenses, setExpenses] = useState(Array<ExpenseType>);
  const [categories, setCagories] = useState(Array<CategoryType>);
  const [comptes, setComptes] = useState(Array<CompteType>);
  const [comptesI, setComptesI] = useState(Array<CompteType>);
  const [stateForm, setStateForm] = useState(true);
  const [idUpdateExpenses, setIdUpdateExpenses] = useState(0);
  const [created, setCreated] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [userMail, setUserMail] = useState('');
  const [userUID, setUserUID] = useState('');
  const [idExpenses, setIdExpenses] = useState<number | null>(null);

  const inputRefDescription = React.useRef<HTMLInputElement>(null);
    const inputRefValue = React.useRef<HTMLInputElement>(null);
    const inputRefCategory = React.useRef<HTMLSelectElement>(null);
    const inputRefDate = React.useRef<HTMLInputElement>(null);
    const inputRefCompte = React.useRef<HTMLSelectElement>(null);
    const inputFilterRefCompte = React.useRef<HTMLSelectElement>(null);

    
  const dateTOday = new Date();
  const date = dateTOday.getMonth();
  const defaultCompte = monthNames[date] + " " + dateTOday.getFullYear();
  const [inputFilter, setInputFilter] = React.useState(defaultCompte);
 
  //get last ID inserted in document expenses
  const fetchLastId = async () => {
    try {
        const q = query(collection(db, "expenses"), orderBy("idexpenses", "desc"), limit(1)); // Limit to 1 document
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const lastId = querySnapshot.docs[0].data().idexpenses;
            console.log(lastId);
            setIdExpenses(lastId + 1); // Set the new ID as the last ID + 1
            console.log("new id then", idExpenses);
        } else {
            setIdExpenses(1); // If no documents found, set ID to 1
        }
    } catch (error) {
        console.error("Error fetching last ID: ", error);
    }
  }

  //list category for select in add form
  const dataCategory = Object.values(categories).map((category) => (
    category.description
  ))

  //list compte for select in add form
  const dataCompte = Object.values(comptes).map((compte) => (
    compte.description
  ))

  const dataCompteID = Object.values(comptes).map((compte) => (
    compte.idcompte
  ))

  async function addExpenses() {
    try{
      const dateValue = inputRefDate.current?.value;
        if(dateValue) {
            await addDoc(collection(db, "expenses"), {
                idexpenses: idExpenses,
                description: inputRefDescription.current?.value,
                dateexpenses: Timestamp.fromDate(new Date(dateValue.toString())),
                categoryexpense: inputRefCategory.current?.value,
                valueexpenses: inputRefValue.current?.value,
                compte: inputRefCompte.current?.value,
                uidUser: userUID
            });
            setCreated(true);
             // Reset form by updating refs to initial values
            if (inputRefDescription.current) inputRefDescription.current.value = "";
            if (inputRefValue.current) inputRefValue.current.value = "";
            if (inputRefDate.current) inputRefDate.current.value = "";
            if (inputRefCategory.current) inputRefCategory.current.value = dataCategory[0];
            if (inputRefCompte.current) inputRefCompte.current.value = dataCompteID[0].toString();

            getExpenses();

            setTimeout(() => {
              setCreated(false);
            }, 1400)
        }  
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
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
  
  //Get all expenses
  const getExpenses = async () => {
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
        setExpenses(newData);
        console.log(expenses)
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
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

  //get all comptes
  async function getComptes() {
    const offset = (currentPage - 1) * itemsPerPage;
    try {
      const q = query(collection(db, "compte"), where("uidUser", "==", userUID), orderBy("idcompte", "asc"));
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map(doc => {

          return {
              idcompte: doc.data().idcompte,
              description: doc.data().description,
              uidUser: doc.data().uidUser
          }
      });
      setComptes(newData);
      } catch (error) {
          console.error("Error fetching documents: ", error);
      }
  }

  //get all categories
  const getCategories = async () => {
      try {
        const q = query(collection(db, "category"), where("uidUser", "==", userUID), orderBy("id", "asc"));
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map(doc => {

            return {
                id: doc.data().id,
                description: doc.data().description,
                uidUser: doc.data().uidUser
            }
        });
        setCagories(newData);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
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

  
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  //pagination control
  const totalPages = Math.ceil(expenses.length / itemsPerPage);

  const handlePageChange = (newPage : any) => {
    setCurrentPage(newPage);
  };

  const handleFilterCompteChange = () => {
    const selectedDesc = inputFilterRefCompte.current?.value || '';
    setInputFilter(selectedDesc);
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

      inputRefDescription.current!.value = expense.description;
      inputRefValue.current!.value = numString;
      inputRefDate.current!.value = newDate.toISOString().slice(0, 10);
      inputRefCategory.current!.value = expense.categoryexpense;
      inputRefCompte.current!.value = expense.compte.toString();
    }
    setIdUpdateExpenses(idexpense);
    setStateForm(false);
  }

  useEffect(() => {
    getCategories();
    getComptes();
    fetchLastId();
    getExpenses();  
    if(inputFilter === 'ALL'){
      
    }
    else{
      getExpensesCurrent(inputFilter);
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
    
  }, [inputRefCompte.current, inputFilterRefCompte.current, inputFilter]);
  
    return (
        <div>
          {(userMail !== '') ? 
            <>
              <Header linkMenu={dataNav}/>
              <main className='main-page'>
                  <div className="container">
                      <Breadcrumb items={itemsBreadcrumb}/>
                      {(userMail !== '') &&  <p> User Email : {userMail}</p>}
                      <div className="main-section page-form-2">
                        <div className="section-form">
                          <FormExpense labelData={labelData} dataCategory={dataCategory} dataCompte={dataCompte} placeholderInput={placeholderInput} inputRefDescription={inputRefDescription} inputRefDateValue={inputRefDate} inputRefValue={inputRefValue} inputRefCategory={inputRefCategory} inputRefCompte={inputRefCompte} stateForm={stateForm} actionBDD={stateForm ? addExpenses : updateExpenses}/>
                          {created && <div className="alert alert-success">{t('message.insertedExpenseSuccess')}</div> }
                          {updated && <div className="alert alert-success">{t('message.updatedExpenseSuccess')}</div> }
                          {deleted && <div className="alert alert-danger">{t('message.deletedExpenseSuccess')}</div> }
                        </div>
                        <div className="section-list">
                          <div className="table-filter">
                            <select name="filter-compte" id="filter-compte" ref={inputFilterRefCompte} onChange={handleFilterCompteChange} value={inputFilter}>
                              {comptes.slice(startIndex, endIndex).map((compte, index) => (
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
                              {expenses.map((list, index) => (
                                <tr key={index}>
                                    <td>{list.idexpenses}</td>
                                    <td>{list.description}</td>
                                    <td>{list.valueexpenses ? formatNumber(list.valueexpenses.toString()) + ' Ar' : 'N/A'}</td>
                                    <td>{list.dateexpenses}</td>
                                    <td>{list.categoryexpense}</td>
                                    <td>{list.compte}</td>
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
            </> :
            (
              <Loader/>
            )
          }
        </div>
                          
    )
}