"use client";
import Loader from "@/src/components/loader/Loader";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";


export default function Login() {

    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [errorExist, setErrorExist] = React.useState(false);
    const [errorForm, setErrorForm] = React.useState('');
    const [codeError, setCodeError] = React.useState('');

    const router = useRouter();

    function connectAccount (e : any) {
        e.preventDefault();
        if(!email && !password) return;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // Set user data in localStorage
            // localStorage.setItem('user', JSON.stringify(user));
            // Optionally, you can set a flag to indicate the user is logged in
            localStorage.setItem('isLoggedIn', 'true');
            setSuccess(true);
            router.push("/expenses");
        })
        .catch((error : any) => {
            const errorCode = error.code;
            setErrorExist(true)
            setCodeError(errorCode)
            manageMessageError();
        });
      };
      

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
        setEmail(e.target.value);
        if(errorExist) setErrorExist(false);
    }

    const onChangePassword = (e : any) => {
        setPassword(e.target.value);
        if(errorExist) setErrorExist(false);
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="form-block-gabarit">
            <div className="form-block-content">
                <h1 className="title-h1">Welcome Back</h1>
                <div className="form-content">
                    <h2 className="title-h2">Login</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email"><i className="icon-mail"></i>Your email</label>
                            <input type="email" id="email" placeholder="Write your email" onChange={onChangeEmail} value={email}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"><i className="icon-lock"></i>Password</label>
                            <div className="form-group-password">
                                <input type={showPassword ? "text" : "password"} id="password" placeholder="Write your password" onChange={onChangePassword} value={password}/>
                                <i className={showPassword ? "icon-eye-off" : "icon-eye"} onClick={toggleShowPassword}></i>
                            </div>
                            {(errorExist && errorForm) && <p className="error-form">{errorForm}</p>}
                        </div>
                        <div className="form-group form-forgot">
                            <Link className="btn btn-link" href="/forgot">Forgot your password?</Link>
                        </div>
                        <div className="form-group form-submit">
                            <button className={(email && password ) ? "btn btn-primary" : "btn btn-primary disabled"} onClick={connectAccount}>Login</button>
                        </div>
                    <p>Don&apos;t have an account? <Link className="btn btn-link" href="/signup">Sign up</Link></p>
                    </form>
                </div>
            </div>
            {success && <Loader />}
        </div>
    );
}