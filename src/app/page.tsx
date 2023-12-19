"use client"
import * as React from 'react';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Kpi from '../components/kpi/Kpi';
import {formatNumber} from '../data/function';
import Breadcrumb from '../components/breadcrumb/Breadcrumb';
import ListExpense from '../components/expense/ListExpense';


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

  //data ListExpense
  const dataList = [
    {
      id: 1,
      date: '2023-12-01',
      category: `${t('category.0')})`,
      value: formatNumber(10000)
    },
    {
      id: 2,
      date: '2023-12-02',
      category: `${t('category.1')})`,
      value: formatNumber(20000)
    },
    {
      id: 3,
      date: '2023-12-03',
      category: `${t('category.2')})`,
      value: formatNumber(30000)
    },
    {
      id: 4,
      date: '2023-12-04',
      category: `${t('category.3')})`,
      value: formatNumber(40000)
    },
    {
      id: 5,
      date: '2023-12-05',
      category: `${t('category.4')})`,
      value: formatNumber(500000)
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
          <section className='main-section detailKpi'>
              <div className="detailKpi-item">
                  <h2 className="title-h2 detailKpi-title">{t('detailKpi.title')}</h2>
                  <p className='detailKpi-text'>{t('detailKpi.text')}</p>
                  <ListExpense dataList={dataList}/>
              </div>
              <div className="detailKpi-item"></div>
          </section>
        </div>
      </main>
      <Footer {...dataFooter}/>
    </>
    
  );
}
