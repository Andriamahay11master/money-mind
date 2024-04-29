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
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, startAt, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { CompteType } from '@/src/models/CompteType';
import Alert from '@/src/components/alert/Alert';

export default function Compte(){
    const { t } = useTranslation('translation');
    const router = useRouter();

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
    const [comptesWP, setCompteWP] = useState(Array<CompteType>);
    const [stateForm, setStateForm] = useState(true);
    const [idUpdateCompte, setIdUpdateCompte] = useState(0);
    const [created, setCreated] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [userUID, setUserUID] = useState('');
    const [userMail, setUserMail] = useState('');
    const [idCompte, setIdCompte] = useState(0);
    const [currentDocument, setCurrentDocument] = useState('');
    const [next, setNext] = useState(true);
    const [prev, setPrev] = useState(false);

    const inputRefDescription = React.useRef<HTMLInputElement>(null);

    //Get Document on compte by ID
    async function getCompteById(id: number) {
        try {
            const q = query(collection(db, "compte"), where("idcompte", "==", id));
            const querySnapshot = await getDocs(q);
            querySnapshot.docs.map(doc => {
                const compteIdDocument = doc.id;
                setCurrentDocument(compteIdDocument);
                return compteIdDocument;
            });
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    }
    //get last ID inserted in document compte
    const fetchLastId = async () => {
        try {
            const q = query(collection(db, "compte"), orderBy("idcompte", "desc"), limit(1)); // Limit to 1 document
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const lastId = querySnapshot.docs[0].data().idcompte;
                setIdCompte(lastId + 1); // Set the new ID as the last ID + 1
            } else {
                setIdCompte(1); // If no documents found, set ID to 1
            }
        } catch (error) {
            console.error("Error fetching last ID: ", error);
        }
    }

    //Add Comptes
    async function addComptes() {
        try{
            await addDoc(collection(db, "compte"), {
                idcompte: idCompte,
                description: inputRefDescription.current?.value,
                uidUser: userUID
            });

            setCreated(true);
            // Reset form by updating refs to initial values
            if (inputRefDescription.current) inputRefDescription.current.value = "";
            
            getComptes();

            setTimeout(() => {
                setCreated(false);
            }, 1400)
                
          }
          catch (error) {
              console.error("Error adding document: ", error);
          }
      }

    //update Compte
    async function updateCompte() {
        try{
            const compteRef = doc(db, "compte", currentDocument);
            updateDoc(compteRef, {
                idcompte: idUpdateCompte,
                description: inputRefDescription.current?.value,
                uidUser: userUID
            });  
            setUpdated(true);
            // Reset form by updating refs to initial values
            if (inputRefDescription.current) inputRefDescription.current.value = "";
            setStateForm(true);

            await getComptes();

            setTimeout(() => {
            setUpdated(false);
            }, 1400)
        }  
        catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    //get all comptes
    async function getComptes() {
        try {
            const q = query(collection(db, "compte"), where("uidUser", "==", userUID), orderBy("idcompte", "asc"), startAt(currentPage), limit(itemsPerPage));
            const querySnapshot = await getDocs(q);
            const newData = querySnapshot.docs.map(doc => {
                return {
                    idcompte: doc.data().idcompte,
                    uidUser: doc.data().uidUser,
                    description: doc.data().description
                }
            });
            setCompte(newData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    }

    //get all comptes
    async function getComptesWP() {
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
            setCompteWP(newData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    }

    //action prev pagination
    const handlePageChangePrev = () => {
        const newPage = currentPage - itemsPerPage;
        setCurrentPage(newPage >= 1 ? newPage : 1);
        setNext(true);
        if (newPage === 1) {
            setPrev(false);
        }
    };
  
  
      //action next pagination
      const handlePageChangeNext = () => {
        const totalComptesWP = comptesWP.length;
        const newPage = currentPage + itemsPerPage;
        setCurrentPage(newPage);
        setPrev(true);
        if (totalComptesWP - newPage < itemsPerPage) {
            setNext(false);
        }
      };

    //delete Compte
    const deleteCompte = async (idcompte: number) => {
        try {
            getCompteById(idcompte);
            const compteRef = doc(db, "compte", currentDocument);
            await deleteDoc(compteRef);
            setDeleted(true);
            await getComptes();
            setTimeout(() => {
                setDeleted(false);
            }, 1400)
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }

    //mode update on form
    const callUpdateForm = (idcompte: number) => {
        const compte = comptes.find((compte) => compte.idcompte === idcompte);
        if (compte) {
            inputRefDescription.current!.value = compte.description;
        }
        getCompteById(idcompte);
        setIdUpdateCompte(idcompte);
        setStateForm(false);
    }

    useEffect(() => {
        fetchLastId();
        getComptes();
        getComptesWP();

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
      }, [idCompte, currentPage]);

    return (
        <div>
            {(userMail !== '') ? 
            <>
                <Header linkMenu={dataNav} userMail={userMail}/>
                <main className='main-page'>
                    <div className="container">
                        <Breadcrumb items={itemsBreadcrumb}/>
                        <div className="main-section page-form">
                            <div className="section-form">
                                <FormCompte labelData={labelData} inputRefDescription={inputRefDescription} stateForm={stateForm} actionBDD={stateForm ? addComptes : updateCompte}/>
                                {created && <Alert state={true} icon="icon-checkmark" type="success" message={t('message.insertedCompteSuccess')}/> }
                                {updated && <Alert state={true} icon="icon-checkmark" type="success" message={t('message.updatedCompteSuccess')}/> }
                                {deleted && <Alert state={true} icon="icon-close" type="danger" message={t('message.deletedCompteSuccess')}/> }
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
                                        {comptes.map((list, index) => (
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
                                    {(comptesWP.length >= 7) && 
                                    <>
                                        <button className={prev ? "btn btn-primary" : "btn btn-primary disabled"} onClick={() => handlePageChangePrev()}>Previous</button>
                                        <button className={next ? "btn btn-primary" : "btn btn-primary disabled"} onClick={() => handlePageChangeNext()}>Next</button>
                                    </>
                                    }
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