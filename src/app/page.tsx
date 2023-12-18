"use client"
import * as React from 'react';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Kpi from '../components/kpi/Kpi';
import {formatNumber} from '../data/function';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';

export default function Home() {

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

  //data KPI 
  const kpi = [
    {
      title: `${t('kpi.0.title')}`,
      value: formatNumber(1600000)
    },
    {
      title: `${t('kpi.1.title')}`,
      value: formatNumber(0)
    },
    {
      title: `${t('kpi.2.title')}`,
      value: formatNumber(0)
    }
  ];

  //data Breadcrumb
  const itemsBreadcrumb = [
    {
      label: `${t('breadcrumb.home')}`,
      path: '/',
    }
  ];

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
        </div>
      </main>
      <Footer {...dataFooter}/>
    </>
    
  );
}
