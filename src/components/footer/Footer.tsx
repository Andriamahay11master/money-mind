import * as React from 'react';
import './footer.scss';
import Link from 'next/link';

interface FooterProps{
    desc: string,
    title: string,
    copyright: string
}

export default function Footer({desc, title, copyright} : FooterProps) {
    
    return (
        <footer className='footerPage'>
            <div className="cntFooter">
                <div className="colFooter">
                    <h2 className='title-h2 titleFooter'>MindMoney </h2>
                    <p className="txtFooter">
                        {desc}
                    </p>
                </div>
                <div className="colFooter">
                    <div className="titleFooter">{title}</div>
                    <div className="listLink">
                        <div className="itemLink">
                            <Link href="https://www.facebook.fr" target='_blank' aria-label="Profil Facebook d'Andriamahay Henikaja Irimanana" title='Profil Facebook'><i className="icon-footer icon-fb"></i></Link>
                        </div>
                        <div className="itemLink">
                            <Link href="https://www.linkedin.com/in/andriamahay-henikaja-irimanana/" target='_blank' aria-label="Profil LinkedIn d'Andriamahay Henikaja Irimanana" title='Profil LinkedIn'><i className="icon-footer icon-linkedin"></i></Link>
                        </div>
                    </div>
                </div>
            </div> 
            <div className="footerCopyright">
                <div className="cntCopyright">
                    <div className="itemCol"> 
                        <p>2024 © {copyright} <Link href="https://andriamahay-irimanana.vercel.app/" target='_blank' className='copyRightLink'>IRIMANANA Henikaja Andriamahay </Link></p>
                    </div>
                </div>
            </div>
        </footer> 
    )
  }
  