'use client';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase';
import Link from 'next/link';
import { Poppin } from '@/src/components/poppin/Poppin';

export default function Signup() {
  const dataSignup = {
    title: "Create an account",
    formdesc: "Enter your email and password below",
    email: "Email",
    password: "Password",
    passwordagain: "Confirm Password",
    labelButton: "Sign up",
    routeSignin: "/login",
    textUser: "Already have an account?",
    labelSignin: "Sign in",
};

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [sucess, setSucess] = useState(false);

  const signup = () => {
    createUserWithEmailAndPassword(auth, email, password);
    setSucess(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};

const togglePasswordConfirmationVisibility = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
};
  
  return (
    <>
    <div className="form-block-gabarit">
             <div className="form-block-content form-signup">
                <div className="logo-block">
                    <span className="logo"></span>
                </div>
                <h1 className="title-h1">{dataSignup.title}</h1>
                <p className="form-desc">{dataSignup.formdesc}</p>
                <div className="form-content">
                        <div className="form-group">
                            <label htmlFor="email"><i className="icon-mail"></i>{dataSignup.email}</label>
                            <input type="email" id="email" placeholder="Email address" value={email} onChange={ (e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><i className="icon-lock"></i>{dataSignup.password}</label>
                            <div className="input-pass">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                                <i className={`icon ${showPassword ? "icon-eye-off" : "icon-eye"}`} onClick={togglePasswordVisibility}></i>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmation-password"><i className="icon-lock"></i>{dataSignup.passwordagain}</label>
                            <div className="input-pass">
                                <input type={showPasswordConfirmation ? "text" : "password"} id="confirmation-password" placeholder="Confirm your Password" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)}/>
                                <i className={`icon ${showPasswordConfirmation ? "icon-eye-off" : "icon-eye"}`} onClick={togglePasswordConfirmationVisibility}></i>
                            </div>
                        </div>  
                        <div className="form-group form-submit">
                            <button className={(email && password && passwordAgain) &&  (password === passwordAgain) ? "btn btn-primary" : "btn btn-primary disabled"} onClick={signup} disabled={(!email || !password || !passwordAgain) || (password !== passwordAgain)}>{dataSignup.labelButton}</button>
                        </div>
                    <p className="text-signup">{dataSignup.textUser} <Link className="btn btn-link" href={dataSignup.routeSignin}>{dataSignup.labelSignin}</Link></p>
                </div>
            </div>
            {sucess && <Poppin title="Account created" message="Account created successfully" linkBtn="/login" valBtn="Sign in"/>}
        </div>
    </>
  )
}