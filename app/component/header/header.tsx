"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import './header.scss';
import Image from 'next/image';
import i18next from 'i18next';

interface HeaderProps {
    linkMenu: {name: string, href: string}[]
}

export default function Header({linkMenu} : HeaderProps) {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [lang, setLang] = useState(false);
    const [langMobile, setLangMobile] = useState(false);
    const pathname = usePathname();
    
    const closeMenu = () => {
        setTimeout(() => {
            setNavbarOpen(false);
        }, 300)
      }

      useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 1200 && navbarOpen) {
                setNavbarOpen(false);
            }
        }
 
        handleResize();
 
        window.addEventListener("resize", handleResize);
 
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [navbarOpen]);


    const changeLanguageMobile = (lg:string) => {
        if(lg === 'fr') {
            i18next.changeLanguage('fr');
            setLangMobile(true);
        } else if(lg === 'en') {
            i18next.changeLanguage('en');
            setLangMobile(false);
        }
        setNavbarOpen(false);
    }

    return (
        <header className={`sectHeader sectHeader--fixed${navbarOpen ? ' show-menu' : ''}`}>
            <div className="headerTop">
                <div className="container-transverse">
                    <div className="headerTopContent">
                        <div className="headerTopCol">
                            <div className="header-reseau-sociaux">
                                <Link className="header-rs-link" href="https://wwww.facebook.fr" target='_blank' title='Profil Facebook'><i className="icon-fb"></i></Link>
                                <Link className="header-rs-link" href="https://www.linkedin.com/in/andriamahay-henikaja-irimanana/" target='_blank' title='Profil LinkedIn'><i className="icon-linkedin"></i></Link>
                            </div>
                        </div>
                        <div className="headerTopCol">
                            <div className="dropdown-language" onClick={() => setLang(!lang)}>
                                <button className='dropdown-default'>{i18next.language}</button>
                                <ul className={`dropdown-language-list ${lang ? ' show-dropdown' : ''}`}>
                                    <li><button className='dropdown-link' onClick={() => changeLanguageMobile('en')}>EN</button></li>
                                    <li><button className='dropdown-link' onClick={() => changeLanguageMobile('fr')}>FR</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="headerIntern"> 
                <div className="container-transverse">
                    <div className="cntLogoMobile">
                            <Link href="/#home" title='Ancre to top'>
                                <figure>
                                    <Image src="/images/Mahay.jpg" alt="Logo Site" width={200} height={200} title='Mahay image'/>
                                </figure>
                                <span className='cntLogo-text'>IRIMANANA Henikaja Andriamahay</span>
                            </Link>
                    </div>
                    <div className={`headerInternContent${navbarOpen ? ' show-menu' : ''}`}>
                        <div className="cntlogo">
                            <Link href="/" title='Ancre to top'>
                                <figure>
                                    <Image src="/images/Mahay.jpg" alt="Logo Site" width={200} height={200} title='Mahay image'/>
                                </figure>
                                <span className='cntLogo-text'>IRIMANANA Henikaja Andriamahay</span>
                            </Link>
                        </div>
                        <div className="boxNavIntern"> 
                            <nav className="menuNav"> 
                                <div className="cntNavBox"> 
                                    <ul className="cntNav">
                                        {linkMenu.map((link) => {
                                            const isActive = pathname === link.href
                                    
                                            return (
                                                <li key={link.name}>
                                                    <Link
                                                        className={isActive ? 'cntNav-link active' : 'cntNav-link'}
                                                        href={link.href}
                                                        onClick={closeMenu} locale="en" title='Link menu'>
                                                        {link.name}
                                                    </Link>
                                                </li>
                                            
                                            )
                                        })}
                                    </ul> 
                                </div> 
                            </nav>  
                        </div>

                        <div className="block-bottom-mobile">
                            <div className="header-reseau-sociaux">
                                <Link className="header-rs-link" href="https://www.facebook.com" target='_blank' title='Profil Facebook'><i className="icon-fb"></i></Link>
                                <Link className="header-rs-link" href="https://www.linkedin.com/in/andriamahay-henikaja-irimanana/" target='_blank' title='Profil LinkedIn'><i className="icon-linkedin"></i></Link>
                            </div>
                            <div className="list-language">
                                <button className={`list-language-link ${!langMobile ? 'active' : ''}`} onClick={() => changeLanguageMobile('en') }>EN</button>
                                <button className={`list-language-link ${langMobile ? 'active' : ''}`} onClick={() => changeLanguageMobile('fr')}>FR</button>
                            </div>
                        </div>
                    </div> 
                    <div className="btnBox">
                        <button className="btn btn-icon btn-mobile" onClick={()=>setNavbarOpen(!navbarOpen)} aria-label="open navBar">
                            <i className={navbarOpen ? "icon-close" : "icon-burger"}></i>
                        </button>
                    </div>  
                </div>
            </div>   
        </header>
    )
  }
  