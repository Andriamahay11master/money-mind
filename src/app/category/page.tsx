"use client"
import Header from '@/src/components/header/Header';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import './page.scss'
import * as React from 'react';
import Footer from '@/src/components/footer/Footer';
import Breadcrumb from '@/src/components/breadcrumb/Breadcrumb';
import FormCategory from '@/src/components/category/FormCategory';
import { useEffect, useState } from 'react';
import Loader from '@/src/components/loader/Loader';
import { useRouter } from 'next/navigation';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { CategoryType } from '@/src/models/CategoryType';
import Alert from '@/src/components/alert/Alert';

export default function Category(){
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
        label: `${t('breadcrumb.category')}`,
        path: '/category',
        }
    ];

    //dataFOrm
    const labelData = [
        `${t('formCategory.title')}`,
        `${t('formCategory.description')}`,
        `${t('formCategory.placeholder')}`,
        `${t('formCategory.placeholderUpdate')}`,
        `${t('formCategory.save')}`,
        `${t('formCategory.update')}`
    ]

    const [categories, setCategory] = useState(Array<CategoryType>);
    const [stateForm, setStateForm] = useState(true);
    const [idUpdateCategory, setIdUpdateCategory] = useState(0);
    const [created, setCreated] = useState(false);
    const [updated, setUpdated] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [userMail, setUserMail] = useState('');
    const [userUID, setUserUID] = useState('');
    const [idCategory, setIdCategory] = useState(0);
    const inputRefDescription = React.useRef<HTMLInputElement>(null);
    const [currentDocument, setCurrentDocument] = useState('');

    //Get Document on category by ID
    async function getCategoryById(id: number) {
      try {
          const q = query(collection(db, "category"), where("id", "==", id));
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

    //get last ID inserted in document category
    const fetchLastId = async () => {
        try {
            const q = query(collection(db, "category"), orderBy("id", "desc"), limit(1)); // Limit to 1 document
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const lastId = querySnapshot.docs[0].data().id;
                setIdCategory(lastId + 1); // Set the new ID as the last ID + 1
            } else {
                setIdCategory(1); // If no documents found, set ID to 1
            }
        } catch (error) {
            console.error("Error fetching last ID: ", error);
        }
    }

    //add category
    async function addCategories() {
      try{
        await addDoc(collection(db, "category"), {
            id: idCategory,
            description: inputRefDescription.current?.value,
            uidUser: userUID
        });

          setCreated(true);
          // Reset form by updating refs to initial values
          if (inputRefDescription.current) inputRefDescription.current.value = "";
          
          getCategories();

          setTimeout(() => {
              setCreated(false);
          }, 1400)
              
        }
        catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    //update category
    async function updateCategory(){
      try{
        const categoryRef = doc(db, "category", currentDocument);
        updateDoc(categoryRef, {
            id: idUpdateCategory,
            description: inputRefDescription.current?.value,
            uidUser: userUID
        });  
        setUpdated(true);
        // Reset form by updating refs to initial values
        if (inputRefDescription.current) inputRefDescription.current.value = "";
        setStateForm(true);

        await getCategories();

        setTimeout(() => {
          setUpdated(false);
        }, 1400)
      }  
      catch (error) {
          console.error("Error adding document: ", error);
      }
    }

    //get categories
    async function getCategories() {
      try {
        const q = query(collection(db, "category"), where("uidUser", "==", userUID), orderBy("id", "asc"));
        const querySnapshot = await getDocs(q);
        const newData = querySnapshot.docs.map(doc => {
            return {
                id: doc.data().id,
                uidUser: doc.data().uidUser,
                description: doc.data().description
            }
        });
        setCategory(newData);
        } catch (error) {
            console.error("Error fetching documents: ", error);
        }
    }
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    //pagination control
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const handlePageChange = (newPage : any) => {
        setCurrentPage(newPage);
    };

    //send the id category to formCategory for update
    const callUpdateForm = (idcategory: number) => {
        const category = categories.find((category) => category.id === idcategory);
        if (category) {
            inputRefDescription.current!.value = category.description;
        }
        getCategoryById(idcategory);
        setIdUpdateCategory(idcategory);
        setStateForm(false);
    }

    //delete category in Firebase
    const deleteCategory = async (idcategory: number) => {
      try {
          getCategoryById(idcategory);
          const categoryRef = doc(db, "category", currentDocument);
          await deleteDoc(categoryRef);
          setDeleted(true);
          await getCategories();
          setTimeout(() => {
              setDeleted(false);
          }, 1400)
      } catch (error) {
          console.error("Error deleting document: ", error);
      }
    }


    useEffect(() => {
      fetchLastId();
      getCategories();

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

      }, [idCategory]);

    return (
        <div>
          {(userMail !== '') ? (
            <>
            <Header linkMenu={dataNav}/>
            <main className='main-page'>
                <div className="container">
                    <Breadcrumb items={itemsBreadcrumb}/>
                        {(userMail !== '') &&  <p> User Email : {userMail}</p>}
                    <div className="main-section page-form">
                      <div className="section-form">
                      <FormCategory labelData={labelData} inputRefDescription={inputRefDescription} stateInsert={stateForm} actionBDD={stateForm ? addCategories : updateCategory} />
                        {created && <Alert state={true} icon="icon-checkmark" type="success" message={t('message.insertedCategorySuccess')}/> }
                        {updated && <Alert state={true} icon="icon-checkmark" type="success" message={t('message.updatedCategorySuccess')}/> }
                        {deleted && <Alert state={true} icon="icon-close" type="danger" message={t('message.deletedCategorySuccess')}/> }
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
                              {categories.map((list, index) => (
                                      <tr key={index}>
                                          <td>{list.id}</td>
                                          <td>{list.description}</td>
                                          <td>
                                              <div className="action-box">
                                                  <button type="button" className="btn btn-icon" onClick={() => callUpdateForm(list.id)}>
                                                      <i className="icon-pencil"></i>
                                                  </button>
                                                  <button className="btn btn-icon" onClick={() => deleteCategory(list.id)}>
                                                      <i className="icon-bin2"></i>
                                                  </button>
                                              </div>
                                          </td>
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
            </>
            ) : (
            <Loader/>
          )}
        </div>    
    )
}