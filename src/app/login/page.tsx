"use client";
import Loader from "@/src/components/loader/Loader";
import React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Login() {
    
    interface UserType {
        iduser: number;
        username: string;
        password: string;
        nom: string;
        prenom: string;
        mail: string;
      }

    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [errorExist, setErrorExist] = React.useState(false);
    const [errorForm, setErrorForm] = React.useState('');
    const [codeError, setCodeError] = React.useState('');
    const [users, setUsers] = React.useState(Array<UserType>);

    const router = useRouter();

    const connectAccount = async () => {
        try{
            await signIn('credentials', { email, password, redirect: false });
            setSuccess(true);
            router.push('/');
        }  catch(error : any) {
            const errorCode = error.code;
            // const errorMessage = error.message;
            console.log(errorCode, error)
            setErrorExist(true)
            setCodeError(errorCode)
            manageMessageError();
        };
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

    async function getUser() {
        const postData = {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        };
        const res = await fetch(`api/users`, postData);
        const response = await res.json();
        const usersArray: UserType[] = Object.values(response.users);
        setUsers(usersArray);
    }

    return (
        <div className="form-block-login">
            <div className="form-block-content">
                <h1 className="title-h1">Welcome Back</h1>
                <div className="form-content">
                    <h2 className="title-h2">Login</h2>
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
                    <p>Don&apos;t have an account? <a className="btn btn-link" href="/signup">Sign up</a></p>
                </div>
            </div>
            {success && <Loader />}
        </div>
    );
}