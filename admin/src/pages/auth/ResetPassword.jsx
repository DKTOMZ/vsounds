import { CSpinner } from "@coreui/react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ErrorBox } from "../utilities/Error";
import { UseModal } from "../utilities/Modal";

export const ResetPassword = () => {
    const [resetPasswordEmail,setResetPasswordEmail] = useState('');
    const emailInput = useRef();
    const [resetError, setResetError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {resetAdminPassword,currentAdmin} = useAuth();
    const [resetPasswordMsg, setResetPasswordMsg] = useState(null);

    useEffect(()=>{
        if (currentAdmin) {navigate('/');}
    },[currentAdmin, navigate]);

    const showErrors = (errorType,error) => {
        if (errorType === 'emailerror') {
            emailInput.current.focus();
        }
        setResetError(error);
    };

    const clearErrors = () => setResetError('');;

    const resetPassword = async(e) => {
        setLoading(true);
        e.preventDefault();
        clearErrors();
        const resetPasswordResponse = await resetAdminPassword(resetPasswordEmail);
        if (resetPasswordResponse.error) { 
            if (resetPasswordResponse.error.includes('email') || resetPasswordResponse.error.includes('user')) {
                showErrors('emailerror',resetPasswordResponse.error);
            }
            else {showErrors('reseterror',resetPasswordResponse.error);}
        } else if (resetPasswordResponse.resetEmail) {
            setResetPasswordMsg(resetPasswordResponse.resetEmail);
        }
        setLoading(false);
    };

    return (
        <div id="reset-password">
            {resetPasswordMsg ? <UseModal title="Password reset email sent!" body={resetPasswordMsg} buttonText='Login' route="/Login"/> : null}
            <form id="reset-password-form" onSubmit={resetPassword}>
                <h2>Reset Password</h2>
                <div id="email-input" className="input">
                    <i className="fa-solid fa-envelope fa-lg"></i>
                    <input ref={emailInput} type="email" placeholder="Email..." name="email" value={resetPasswordEmail} onChange={(e)=>setResetPasswordEmail(e.target.value)} id="user-email" required/>
                </div>
                <ErrorBox error={resetError}/>
                <button disabled={loading} id="submit-button">Reset {loading ? <CSpinner  style={{marginLeft:'10px'}}/>: null}</button>
            </form>
        </div>
    );
};