"use client"
import Header from '@/src/components/header/Header';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import './page.scss'
import * as React from 'react';
import Footer from '@/src/components/footer/Footer';
import Breadcrumb from '@/src/components/breadcrumb/Breadcrumb';
import { formatNumber } from '@/src/data/function';
import FormCategory from '@/src/components/category/FormCategory';

export default function Category(){
    const { t } = useTranslation('translation');

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
        label: `${t('breadcrumb.category')}`,
        path: '/category',
        }
    ];

    //dataFOrm
    const labelData = [
        `${t('formCategory.title')}`,
        `${t('formCategory.description')}`,
        `${t('formCategory.placeholder')}`,
        `${t('formCategory.save')}`
    ]

    return (
        <div>
            <Header linkMenu={dataNav}/>
            <main className='main-page'>
                <div className="container">
                    <Breadcrumb items={itemsBreadcrumb}/>
                    <div className="main-section section-form">
                        <FormCategory labelData={labelData}/>
                    </div>
                </div>
            </main>
            <Footer {...dataFooter}/>
        </div>    
    )
}