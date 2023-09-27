import React, { useRef, useState } from "react";
import { CSpinner } from "@coreui/react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ErrorBox } from "../utilities/Error";
import { UseModal } from "../utilities/Modal";

export const SignUp = () => {
    const {currentUser} = useAuth();
    const [loading, setLoading] = useState(false);
    const [signupEmail,setSignupEmail] = useState('');
    const [signupPassword,setSignupPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [signupError, setSignupError] = useState('');
    const emailInput = useRef();
    const passwordInput = useRef();
    const {registerUser} = useAuth();
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
        setSignupError(error);
    };

    const clearErrors = () => setSignupError('');

    const signup = async(e) => {
        setLoading(true);
        e.preventDefault();
        clearErrors();
        const signupResponse = await registerUser(signupEmail,signupPassword);
        if (signupResponse.error) { 
            if (signupResponse.error.includes('email') || signupResponse.error.includes('user')) {
                showErrors('emailerror',signupResponse.error);
            }
            else if (signupResponse.error.includes('password')) {
                showErrors('passworderror',signupResponse.error);
            }
            else {showErrors('loginerror',signupResponse.error);}
        } else if (signupResponse.verifyEmail) {
            setVerifyEmailMsg(signupResponse.verifyEmail);
        }
        setLoading(false);
    };

    return (
        <>
        {currentUser && !loading && !verifyEmailMsg ? <Navigate to={'/'} replace/>
        : 
        <div id="signup">
            {verifyEmailMsg ? <UseModal title="Registration Success!" body={verifyEmailMsg} buttonText='Login' route="/Login"/> : null}
            <form id="signup-form" onSubmit={signup}>
                <h2>Signup</h2>
                <br/>
                <div id="email-input" className="input">
                    <i className="fa-solid fa-envelope fa-lg"></i>
                    <input ref={emailInput} type="email" placeholder="Email..." name="email" value={signupEmail} onChange={(e)=>setSignupEmail(e.target.value)} id="user-email" required/>
                </div>
                <div id="password-input" className="input">
                    <i className="fa-solid fa-lock fa-lg"></i>
                    <input ref={passwordInput} type="password" placeholder="Password..." name="password" value={signupPassword} 
                        onChange={(e)=>setSignupPassword(e.target.value)} id="user-password" 
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
                        required/>
                    <div id="toggle-password" onClick={togglePassword}>
                        {showPassword ? <i className="fa-regular fa-eye-slash fa-lg"></i> : <i className="fa-regular fa-eye fa-lg"></i>}    
                    </div>                
                </div>
                <ErrorBox error={signupError}/>
                <button id="submit-button" disabled={loading}>Signup {loading ? <CSpinner style={{marginLeft:'10px'}}/>: null}</button>
                <br/>
                <div id="to-login-signup">Already a member? Login<Link className="to-login-signup" to="/Login">Here</Link></div>
            </form>
        </div>
        }
                </>
    );
};