"use client"
import * as React from 'react';
import '@/src/app/i18n';
import { useTranslation } from 'next-i18next';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

export default function Home() {

  const { t } = useTranslation('translation');

  //Data Nav
  const dataNav = [
    {
        name: `${t('menu.home')}`,
        href: '/#home'   
    },  
    {
        name: `${t('menu.about')}`,
        href: '/#about'
    } ,
    {
        name: `${t('menu.projects')}`,
        href: '/#projects'
    },
    {
        name: `${t('menu.contact')}`,
        href: '/#contact'
    }
  ];

  //data footer
  const dataFooter = {
    title: `${t('footer.title')}`,
    desc: `${t('footer.desc')}`,
    copyright: `${t('footer.copyright')}`,
  }

  return (
    <>
      <Header linkMenu={dataNav}/>
      <Footer {...dataFooter}/>
    </>
    
  );
}
