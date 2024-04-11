"use client";
import Loader from "@/src/components/loader/Loader";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import './page.scss'



interface LoginProps {
    user: any
}
export default function Login({user} : LoginProps) {
    
    const [showPassword, setShowPassword] = React.useState(false);
    const [emailu, setEmailu] = React.useState('');
    const [passwordu, setPasswordu] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [errorExist, setErrorExist] = React.useState(false);
    const [errorForm, setErrorForm] = React.useState('');
    const [codeError, setCodeError] = React.useState('');

    const router = useRouter();

    const connectAccount = (e : any) => {
        e.preventDefault();
        if(!emailu && !passwordu) return;
        signInWithEmailAndPassword(auth, emailu, passwordu)
        .then((userCredential) => {
            const user = userCredential.user;
            // Set user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            // Optionally, you can set a flag to indicate the user is logged in
            localStorage.setItem('isLoggedIn', 'true');
            setSuccess(true);
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            // const errorMessage = error.message;
            console.log(errorCode, error.message)
            setErrorExist(true)
            setCodeError(errorCode)
            manageMessageError();
        });
    }

    const manageMessageError = () => {
        switch(codeError) {
            case 'auth/invalid-email':
                setErrorForm('Invalid email');
                break;
            case 'auth/missing-password':
                setErrorForm('Missing password');
                break;
            case 'auth/invalid-credential':
                setErrorForm('Invalid credential');
                break;
            default:
                setErrorForm('Invalid email or password');
                break;
        }
    }

    const onChangeEmail = (e : any) => {
        setEmailu(e.target.value);
        if(errorExist) setErrorExist(false);
    }

    const onChangePassword = (e : any) => {
        setPasswordu(e.target.value);
        if(errorExist) setErrorExist(false);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    if(user && localStorage.getItem('isLoggedIn') === 'true') {
        console.log("********signi in",localStorage.getItem('isLoggedIn'));
        router.push('/');
    }

    return (
        <div className="form-block">
            <h1 className="title-h1">Welcome Back</h1>
            <div className="form-content">
                <h2 className="title-h2">Login</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="email"><i className="icon-mail"></i>Your email</label>
                        <input type="email" id="email" placeholder="Write your email" onChange={onChangeEmail}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"><i className="icon-lock"></i>Password</label>
                        <div className="form-group-password">
                            <input type={showPassword ? "text" : "password"} id="password" placeholder="Write your password" onChange={onChangePassword}/>
                            <i className={showPassword ? "icon-eye-off" : "icon-eye"} onClick={toggleShowPassword}></i>
                        </div>
                        {(errorExist && errorForm) && <p className="error-form">{errorForm}</p>}
                    </div>
                    <div className="form-group form-forgot">
                        <a className="btn btn-link" href="/forgot">Forgot your password?</a>
                    </div>
                    <div className="form-group form-submit">
                        <button className="btn btn-primary" onClick={connectAccount}>Login</button>
                    </div>
                </form>
                <p>Don&apos;t have an account? <a className="btn btn-link" href="/signup">Sign up</a></p>
            </div>
            {success && <Loader />}
        </div>
    );
}