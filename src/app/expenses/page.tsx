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
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { ExpenseType } from '@/src/models/ExpenseType'; 
import { CategoryType } from '@/src/models/CategoryType';
import { CompteType } from '@/src/models/CompteType';
import Alert from '@/src/components/alert/Alert';
import ExportCSV from '@/src/components/csv/ExportCsv';
import ExportExcel from '@/src/components/excel/ExportExcel';

export default function Expenses() {
    const { t } = useTranslation('translation');
    const router = useRouter();

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
  const [expensesWP, setExpensesWP] = useState(Array<ExpenseType>);
  const [categories, setCagories] = useState(Array<CategoryType>);
  const [comptes, setComptes] = useState(Array<CompteType>);
  const [stateForm, setStateForm] = useState(true);
  const [idUpdateExpenses, setIdUpdateExpenses] = useState(0);
  const [created, setCreated] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [userMail, setUserMail] = useState('');
  const [userUID, setUserUID] = useState('');
  const [idExpenses, setIdExpenses] = useState<number | null>(null);
  const [currentDocument, setCurrentDocument] = useState('');
  const [next, setNext] = useState(true);
  const [prev, setPrev] = useState(false);

  const inputRefDescription = React.useRef<HTMLInputElement>(null);
  const inputRefValue = React.useRef<HTMLInputElement>(null);
  const inputRefCategory = React.useRef<HTMLSelectElement>(null);
  const inputRefDate = React.useRef<HTMLInputElement>(null);
  const inputRefCompte = React.useRef<HTMLSelectElement>(null);
  const inputFilterRefCompte = React.useRef<HTMLSelectElement>(null);
  const inputFilterRefCategory = React.useRef<HTMLSelectElement>(null);

    
  const dateTOday = new Date();
  const date = dateTOday.getMonth();
  const defaultCompte = monthNames[date] + " " + dateTOday.getFullYear();
  const [inputFilter, setInputFilter] = React.useState(defaultCompte);
  const [inputFilterCategory, setInputFilterCategory] = React.useState('ALL');
 
  //get last ID inserted in document expenses
  const fetchLastId = async () => {
    try {
        const q = query(collection(db, "expenses"), orderBy("idexpenses", "desc"), limit(1)); // Limit to 1 document
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const lastId = querySnapshot.docs[0].data().idexpenses;
            const newID = lastId + 1;
            setIdExpenses(newID); // Set the new ID as the last ID + 1
            console.log("LastID", lastId);
            console.log("NewID", idExpenses); 
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

  // const dataCompteID = Object.values(comptes).map((compte) => (
  //   compte.idcompte
  // ))

  //Function test choice displaying expenses
  function displayExpenses(){
    const selectedDesc = inputFilterRefCompte.current?.value ?? '';
    if(selectedDesc === 'ALL'){
      getExpenses();
    }
    else{
      getExpensesCurrent(selectedDesc);
    }
  }
  //add expense in firebase
  async function addExpenses() {
    try{
      const dateValue = inputRefDate.current?.value;
      await fetchLastId();
        if(dateValue) {
            await addDoc(collection(db, "expenses"), {
                idexpenses: idExpenses,
                description: inputRefDescription.current?.value,
                dateexpenses: Timestamp.fromDate(new Date(dateValue.toString())),
                categoryexpense: inputRefCategory.current?.value,
                valueexpenses: parseInt(inputRefValue.current?.value ?? "0"),
                compte: inputRefCompte.current?.value,
                uidUser: userUID
            });
            setCreated(true);
             // Reset form by updating refs to initial values
            if (inputRefDescription.current) inputRefDescription.current.value = "";
            if (inputRefValue.current) inputRefValue.current.value = "";
            if (inputRefDate.current) inputRefDate.current.value = "";
            if (inputRefCategory.current) inputRefCategory.current.value = dataCategory[0];
            if (inputRefCompte.current) inputRefCompte.current.value = dataCompte[0];

            await displayExpenses();

            setTimeout(() => {
              setCreated(false);
            }, 1400)
        }  
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
  }

  //update expense in firebase
  async function updateExpenses() {
    try{
      const dateValue = inputRefDate.current?.value;
        if(dateValue) {
            const expenseRef = doc(db, "expenses", currentDocument);
            updateDoc(expenseRef, {
              idexpenses: idUpdateExpenses,
              description: inputRefDescription.current?.value,
              dateexpenses: Timestamp.fromDate(new Date(dateValue.toString())),
              categoryexpense: inputRefCategory.current?.value,
              valueexpenses: parseInt(inputRefValue.current?.value ?? "0"),
              compte: inputRefCompte.current?.value,
              uidUser: userUID
            });  
            setUpdated(true);
            // Reset form by updating refs to initial values
            if (inputRefDescription.current) inputRefDescription.current.value = "";
            if (inputRefValue.current) inputRefValue.current.value = "";
            if (inputRefDate.current) inputRefDate.current.value = "";
            if (inputRefCategory.current) inputRefCategory.current.value = dataCategory[0];
            if (inputRefCompte.current) inputRefCompte.current.value = dataCompte[0];
            setStateForm(true);
            await displayExpenses();

            setTimeout(() => {
              setUpdated(false);
            }, 1400)
        }  
    }
    catch (error) {
        console.error("Error adding document: ", error);
    }
  }
  
  //Get all expenses in firebase without pagination
  const getExpensesWithoutPagination = async () => {
    try {
      let q;
      if(inputFilterCategory !== 'ALL'){
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("categoryexpense","==", inputFilterCategory), orderBy("idexpenses", "asc"));
      }
      else{
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), orderBy("idexpenses", "asc"));
      }
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
        setExpensesWP(newData);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

  //Get all expenses in firebase
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
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

//Get Document on expense by ID
  async function getExpenseById(id: number) {
    try {
        const q = query(collection(db, "expenses"), where("idexpenses", "==", id));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.map(doc => {
            const expenseIdDocument = doc.id;
            setCurrentDocument(expenseIdDocument);
            return expenseIdDocument;
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

  //Get Document on expense by ID
  const getExpensesByCategory = async (val : string) => {
    try {
      let q;
      if(val === 'ALL'){
        if(inputFilter === 'ALL'){
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), orderBy("idexpenses", "asc"));
        }
        else{
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("compte", "==", inputFilter), orderBy("idexpenses", "asc"));
        }
      }else{
        if(inputFilter === 'ALL'){
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("categoryexpense", "==", val), orderBy("idexpenses", "asc"));
        }
        else{
           q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("categoryexpense", "==", val), where("compte", "==", inputFilter), orderBy("idexpenses", "asc"));
        }
      }
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

  //delete expense
  async function deleteExpense(id: number) {
    try {
        getExpenseById(id);
        const expenseRef = doc(db, "expenses", currentDocument);
        await deleteDoc(expenseRef);
        setDeleted(true);
        await displayExpenses();
        setTimeout(() => {
            setDeleted(false);
        }, 1400)
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
  }

  //get all comptes
  async function getComptes() {
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

  //Get Expenses for selected filter
  async function getExpensesCurrent(valAccount: string) {
    try {
      let q;
        if(inputFilterCategory !== "ALL"){
          if(valAccount !== 'ALL'){
            q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("compte", "==", valAccount), where("categoryexpense", "==", inputFilterCategory), orderBy("idexpenses", "asc"));
          }
          else{
            q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("categoryexpense", "==", inputFilterCategory), orderBy("idexpenses", "asc"));
          }
        }else{
          if(valAccount !== 'ALL'){
            q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("compte", "==", valAccount), orderBy("idexpenses", "asc"));
          }
          else{
            q = query(collection(db, "expenses"), where("uidUser", "==", userUID), orderBy("idexpenses", "asc"));
          }
        }  
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
        console.log("list expenses", newData)
        console.log("list expenses", expenses)
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

  //Get Expenses for selected filter without pagination
  async function getExpensesCurrentWithoutPagination(valAccount: string) {
    try {
      let q;
      if(inputFilterCategory !== "ALL"){
        if(valAccount !== 'ALL'){
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("compte", "==", valAccount), where("categoryexpense", "==", inputFilterCategory), orderBy("idexpenses", "asc"));
        }
        else{
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("categoryexpense", "==", inputFilterCategory), orderBy("idexpenses", "asc"));
        }
      }
      else{
        if(valAccount !== 'ALL'){
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), where("compte", "==", valAccount), orderBy("idexpenses", "asc"));
        }
        else{
          q = query(collection(db, "expenses"), where("uidUser", "==", userUID), orderBy("idexpenses", "asc"));
        }
      }
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
        setExpensesWP(newData);
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
  }

  //action filter compte change
  const handleFilterCompteChange = () => {
    const selectedDesc = inputFilterRefCompte.current?.value || '';
    setInputFilter(selectedDesc);
    setPrev(false);
    setNext(true);
    if(selectedDesc === 'ALL'){
      getExpenses();
    }
    else{
      getExpensesCurrent(selectedDesc);
    }
  };

  //action filter category change
  const handleFilterCategoryChange = () => {
    const selectedDesc = inputFilterRefCategory.current?.value || '';
    setInputFilterCategory(selectedDesc);
    setPrev(false);
    setNext(true);
    if(selectedDesc === 'ALL'){
      getExpenses();
    }
    else{
      getExpensesByCategory(selectedDesc);
    }
  };

  //Fetch data on update and Document ID for idexpense
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
      inputRefCompte.current!.value = expense.compte;
      getExpenseById(idexpense);
    }
    setIdUpdateExpenses(idexpense);
    setStateForm(false); //change form to state update
  }

  useEffect(() => {
    getCategories();
    getComptes();
    fetchLastId();
    if(inputFilter === 'ALL'){
      if(inputFilterCategory === 'ALL'){
        getExpenses();
        getExpensesWithoutPagination();
      }
      else{
        getExpensesByCategory(inputFilterCategory);
      }
    }
    else{
      getExpensesCurrent(inputFilter);
      console.log("expenses current", expenses)
      getExpensesCurrentWithoutPagination(inputFilter)
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
    
  }, [inputRefCompte.current, inputFilterRefCompte.current, inputFilter, inputFilterRefCategory.current, inputFilterCategory, prev, next]);
  
    return (
        <div>
          {(userMail !== '') ? 
            <>
              <Header linkMenu={dataNav} userMail={userMail}/>
              <main className='main-page'>
                  <div className="container">
                      <Breadcrumb items={itemsBreadcrumb}/>
                      <div className="main-section page-form-2">
                        <div className="section-form">
                          <FormExpense labelData={labelData} dataCategory={dataCategory} dataCompte={dataCompte} placeholderInput={placeholderInput} inputRefDescription={inputRefDescription} inputRefDateValue={inputRefDate} inputRefValue={inputRefValue} inputRefCategory={inputRefCategory} inputRefCompte={inputRefCompte} stateForm={stateForm} actionBDD={stateForm ? addExpenses : updateExpenses}/>
                          {created && <Alert state={true} icon="icon-checkmark" type="success" message={t('message.insertedExpenseSuccess')}/> }
                          {updated && <Alert state={true} icon="icon-checkmark" type="success" message={t('message.updatedExpenseSuccess')}/> } 
                          {deleted && <Alert state={true} icon="icon-close" type="danger" message={t('message.deletedExpenseSuccess')}/> }
                        </div>
                        <div className="section-list">
                          <div className="table-filter">
                            <ExportCSV data={expenses} />
                            <ExportExcel data={expenses} nameFile='expenses' nameSheet='Expenses'/>
                            <select name="filter-category" id="filter-category" ref={inputFilterRefCategory} onChange={handleFilterCategoryChange} value={inputFilterCategory} defaultValue={'ALL'}>
                              {categories.map((category, index) => (
                                <option key={index} value={category.description}>{category.description}</option>
                              ))}
                              <option value="ALL">Tous</option>
                            </select>   
                            <select name="filter-compte" id="filter-compte" ref={inputFilterRefCompte} onChange={handleFilterCompteChange} value={inputFilter}>
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