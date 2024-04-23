"use client"
import Header from '@/src/components/header/Header';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import './page.scss'
import * as React from 'react';
import Footer from '@/src/components/footer/Footer';
import Breadcrumb from '@/src/components/breadcrumb/Breadcrumb';
import FormCompte from '@/src/components/compte/FormCompte';
import { useEffect, useState } from 'react';
import Loader from '@/src/components/loader/Loader';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { CompteType } from '@/src/models/CompteType';

export default function Compte(){
    const { t } = useTranslation('translation');

    //state pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Choose the number of items to display per page

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
        label: `${t('breadcrumb.compte')}`,
        path: '/compte',
        }
    ];

    //dataFOrm
    const labelData = [
        `${t('formCompte.title')}`,
        `${t('formCompte.description')}`,
        `${t('formCompte.placeholder')}`,
        `${t('formCompte.placeholderUpdate')}`,
        `${t('formCompte.save')}`,
        `${t('formCompte.update')}`
    ]

    const [comptes, setCompte] = useState(Array<CompteType>);
    const [stateForm, setStateForm] = useState(true);
    const [idUpdateCompte, setIdUpdateCompte] = useState(0);
    const [created, setCreated] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [userUID, setUserUID] = useState('');
    const [userMail, setUserMail] = useState('');
    const router = useRouter();

    const inputRefDescription = React.useRef<HTMLInputElement>(null);

    const dataList = Object.values(comptes).map((compte) => ({
        idcompte: compte.idcompte,
        description: compte.description
    }));

    async function addComptes() {
        const postData = {
          method: "POST",
          headers :{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: inputRefDescription.current?.value,
          })
        };
        const res = await fetch(`api/addCompte?desc=${inputRefDescription.current?.value}`, postData);
        const response = await res.json();
        setCompte(response.comptes);
    
    
        // Reset form by updating refs to initial values
        if (inputRefDescription.current) inputRefDescription.current.value = "";
    
        // Now, fetch the updated comptes
        getComptes();
        
        setCreated(true);
    
        setTimeout(() => {
          setCreated(false);
        }, 1400)
      }

    async function updateCompte() {
        const postData = {
          method: "PUT",
          headers :{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idcompte: idUpdateCompte,
            description: inputRefDescription.current?.value,
          })
        };
        const res = await fetch(`/api/updateCompte?idcompte=${idUpdateCompte}&description=${inputRefDescription.current?.value}`, postData);
        const response = await res.json();
        setCompte(response.comptes);
        // Reset form by updating refs to initial values
        if (inputRefDescription.current) inputRefDescription.current.value = "";
    
        // Now, fetch the updated comptes
        getComptes();
        
        setUpdated(true);
    
        setTimeout(() => {
            setUpdated(false);
            setStateForm(true);
        }, 1400)
    }

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
            setCompte(newData);
            console.log("list comptes nnnnewData",newData)
            console.log("list comptes",comptes)
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    //pagination control
    const totalPages = Math.ceil(comptes.length / itemsPerPage);

    const handlePageChange = (newPage : any) => {
        setCurrentPage(newPage);
    };

    const deleteCompte = async (idcompte: number) => {
        const postData = {
            method: "DELETE",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idcompte: idcompte
            })
        };
        const res = await fetch(`/api/deleteCompte?idcompte=${idcompte}`, postData);
        const response = await res.json();
        setCompte(response.comptes);
        getComptes();
        setDeleted(true);
        setTimeout(() => {
            setDeleted(false);
        }, 1400)
    }

    const callUpdateForm = (idcompte: number) => {
        const compte = comptes.find((compte) => compte.idcompte === idcompte);
        if (compte) {
            inputRefDescription.current!.value = compte.description;
        }
        setIdUpdateCompte(idcompte);
        setStateForm(false);
    }

    useEffect(() => {
        getComptes();

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
      }, []);

    return (
        <div>
            {(userMail !== '') ? 
            <>
                <Header linkMenu={dataNav}/>
                <main className='main-page'>
                    <div className="container">
                        <Breadcrumb items={itemsBreadcrumb}/>
                        {(userMail !== '') &&  <p> User Email : {userMail}</p>}
                        <div className="main-section page-form">
                            <div className="section-form">
                                <FormCompte labelData={labelData} inputRefDescription={inputRefDescription} stateForm={stateForm} actionBDD={stateForm ? addComptes : updateCompte}/>
                                {created && <div className="alert alert-success">{t('message.insertedCompteSuccess')}</div> }
                                {updated && <div className="alert alert-success">{t('message.updatedCompteSuccess')}</div> }
                                {deleted && <div className="alert alert-danger">{t('message.deletedCompteSuccess')}</div> }
                            </div>
                            <div className="section-list">
                                <div className="list-block list-view">
                                    <table className='list-table'>
                                    <thead>
                                        <tr>
                                            <th>{t('table.id')}</th>
                                            <th>{t('table.description')}</th>
                                            <th>{t('table.action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {dataList.map((list, index) => (
                                        <tr key={index}>
                                            <td>{list.idcompte}</td>
                                            <td>{list.description}</td>
                                            <td><div className="action-box"><button type="button" className='btn btn-icon' onClick={() => callUpdateForm(list.idcompte)}> <i className="icon-pencil"></i></button> <button className="btn btn-icon" onClick={() => deleteCompte(list.idcompte)}><i className="icon-bin2"></i></button></div></td>
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
            )}
        </div>    
    )
}