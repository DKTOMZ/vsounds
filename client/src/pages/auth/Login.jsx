import { CSpinner } from "@coreui/react";
import React, { useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ErrorBox } from "../utilities/Error";
import { UseModal } from "../utilities/Modal";

export const Login = () => {
    const {state} = useLocation();
    const [loginEmail,setLoginEmail] = useState('');
    const [loginPassword,setLoginPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const emailInput = useRef();
    const passwordInput = useRef();
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const {loginUser, loginWithGoogle} = useAuth();
    const [verifyEmailMsg, setVerifyEmailMsg] = useState(null);

    const togglePassword = () => {
        passwordInput.current.focus();
        if (showPassword) {
            passwordInput.current.type = 'password';
            setShowPassword(false);
        } else {
            passwordInput.current.type = 'text';
            setShowPassword(true);
        }
    };

    const showErrors = (errorType,error) => {
        if (errorType === 'emailerror') {
            emailInput.current.focus();
        }
        else if (errorType === 'passworderror') {
            passwordInput.current.focus();
        }
        setLoginError(error);
    };

    const clearErrors = () => setLoginError('');

    const loginGoogle = async() => {
        setLoadingGoogle(true);
        clearErrors();
        const googleResponse = await loginWithGoogle();
        if (googleResponse.error) {showErrors('googleLoginError', googleResponse.error);}
        else {
            if (state) {navigate(state.route, {replace:true});}
            else {navigate('/', {replace:true});}
        }
        setLoadingGoogle(false);
    };

    const login = async(e) => {
        setLoading(true);
        e.preventDefault();
        clearErrors();
        const loginResponse = await loginUser(loginEmail,loginPassword,rememberMe);
        if (loginResponse.error) { 
            if (loginResponse.error.includes('email') || loginResponse.error.includes('user')) {
                showErrors('emailerror',loginResponse.error);
            }
            else if (loginResponse.error.includes('password')) {
                showErrors('passworderror',loginResponse.error);
            }
            else {showErrors('loginerror',loginResponse.error);}
        } else if (loginResponse.verifyEmail) {
            setVerifyEmailMsg(loginResponse.verifyEmail);
        } else {
            if (state) {navigate(state.route, {replace:true});}
            else {navigate('/', {replace:true});}
        }
        setLoading(false);   
    };
    
    return (
        <>
        {currentUser ? <Navigate to={'/'} replace/>
        :
        <div id="login">
            {verifyEmailMsg ? <UseModal title="Verify Email!" body={verifyEmailMsg} buttonText='Close' route="/Login"/> : null}
            <h2>Login</h2>
            <button className="google-btn"  disabled={loadingGoogle} onClick={loginGoogle}><i className="fa-brands fa-google"></i> Login with google {loadingGoogle ? <CSpinner style={{marginLeft:'10px'}}/>: null}</button>
            <form id="login-form" onSubmit={login}>
                <hr />
                <div id="email-input" className="input">
                    <i className="fa-solid fa-envelope fa-lg"></i>
                    <input ref={emailInput} type="email" placeholder="Email..." name="email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} id="user-email" required/>
                </div>
                <div id="password-input" className="input">
                    <i className="fa-solid fa-lock fa-lg"></i>
                    <input ref={passwordInput} type="password" placeholder="Password..." name="password" value={loginPassword}
                        onChange={(e)=>setLoginPassword(e.target.value)} id="user-password" 
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
                        required/>
                    <div id="toggle-password" onClick={togglePassword}>
                        {showPassword ? <i className="fa-regular fa-eye-slash fa-lg"></i> : <i className="fa-regular fa-eye fa-lg"></i>}    
                    </div>
                </div>
                <div className="checkbox">
                    <input type="checkbox" name="remember" checked={rememberMe} onChange={()=>setRememberMe(!rememberMe)}/> Remember me
                </div>
                <ErrorBox error={loginError}/>
                <Link id="reset-password" to="/ResetPassword">Forgot Password?</Link>
                <button id="submit-button" disabled={loading}>Login {loading ? <CSpinner style={{marginLeft:'10px'}}/>: null}</button>
                <br/>
                <div id="to-login-signup">Don't have an account yet? Register<Link className="to-login-signup" to="/Signup">Here</Link></div>
            </form>
        </div>
        }
        </>
    );
};