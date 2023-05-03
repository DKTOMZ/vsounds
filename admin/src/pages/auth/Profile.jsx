import { CSpinner } from "@coreui/react";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ErrorBox } from "../utilities/Error";
import { UseModal } from "../utilities/Modal";

export const AdminProfile = () => {
    const {updateAdminProfile,currentAdmin} = useAuth();
    const [AdminName, setAdminName] = useState(currentAdmin.displayName || '');
    const [newAdminPassword, setNewAdminPassword] = useState('');
    const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmshowPassword, setConfirmShowPassword] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(currentAdmin.photoURL || '');
    const emailInput = useRef();
    const nameInput = useRef();
    const avatarLink = useRef();
    const passwordInput = useRef();
    const confirmPasswordInput = useRef();
    const [togglePasswordChange,setTogglePasswordChange] = useState('Set New Password');
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState(null);

    useEffect(()=>{
        changePassword ? setTogglePasswordChange('Keep Current Password') : setTogglePasswordChange('Set New Password');
    },[changePassword]);

    const togglePassword = (elementRef) => {
        if (elementRef === passwordInput){
            if (showPassword) {
                elementRef.current.type = 'password';
                setShowPassword(false);
            }
            else {
                elementRef.current.type = 'text';
                setShowPassword(true);
            }
        }
        else {
            if (confirmshowPassword) {
                elementRef.current.type = 'password';
                setConfirmShowPassword(false);
            }
            else {
                elementRef.current.type = 'text';
                setConfirmShowPassword(true);
            }
        }
    };

    const showErrors = (errorType,error) => {
        if (errorType === 'emailerror') {
            emailInput.current.focus();
        }
        else if (errorType === 'passworderror') {
            confirmPasswordInput.current.focus();
        }
        setProfileError(error);
    };

    const clearErrors = () => setProfileError('');

    const updateProfile = async(e) => {
        setLoading(true);
        e.preventDefault();
        clearErrors();
        if (newAdminPassword !== confirmAdminPassword) {
            return showErrors('passworderror','Passwords don\'t match');
        }
        const updateProfileResponse = await updateAdminProfile(avatarUrl,AdminName, changePassword ? newAdminPassword : null);
        setNewAdminPassword('');
        setConfirmAdminPassword('');
        if (updateProfileResponse) {
            if (updateProfileResponse.passworderror) {showErrors('passworderror',updateProfileResponse.passworderror);}
            else {showErrors('profileerror',updateProfileResponse.profileerror)}
        }
        else {setProfileSuccess('Your Profile has been updated successfully.')}
        setLoading(false);
    };

    return (
        <div id="admin-profile">
            {profileSuccess ? <UseModal title="Profile Updated!" body={profileSuccess} buttonText='Close' route="/Profile"/> : null}
            <form id="admin-details" onSubmit={updateProfile}>
                <h2>Profile</h2>
                <div id="avatar">
                    <img referrerPolicy="no-referrer" src={avatarUrl} alt="Your avatar"></img>
                </div>
                <label htmlFor="avatar-link" className="label">Avatar Image Url</label>
                <div id="Admin-avatar-link" className="input" name="avatar-link">
                    <i className="fa-solid fa-image fa-lg"></i>
                    <input ref={avatarLink} type="url" placeholder="Image url..." name="avatar-url" value={avatarUrl} onChange={(e)=>setAvatarUrl(e.target.value)}/>
                </div>
                <label htmlFor="Admin-email" className="label">Email</label>
                <div id="Admin-email" className="input" name="Admin-email">
                    <i className="fa-solid fa-envelope fa-lg"></i>
                    <input ref={emailInput} type="email" placeholder="Email..." name="email" value={currentAdmin.email} readOnly required/>
                </div>
                <label htmlFor="Admin-name" className="label">Name</label>
                <div id="Admin-name" className="input" name="Admin-name">
                    <i className="fa-solid fa-user fa-lg"></i>
                    <input ref={nameInput} type="text" placeholder="Name..." name="AdminName" value={AdminName} onChange={(e)=>setAdminName(e.target.value)}/>
                </div>
                <div id="toggle-password-change" onClick={()=>{
                    setChangePassword(!changePassword);
                    setNewAdminPassword('');
                    setConfirmAdminPassword('');
                    }}>{togglePasswordChange}</div>
                {changePassword ?
                    <div>
                        <label htmlFor="new" className="label">New Password</label>
                        <div id="change-password" className="input" name="new">
                            <i className="fa-solid fa-lock fa-lg"></i>
                            <input ref={passwordInput} type="password" placeholder="Password..." name="password" value={newAdminPassword}
                                onChange={(e)=>setNewAdminPassword(e.target.value)} 
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
                                required/>
                            <div id="toggle-password" onClick={()=>togglePassword(passwordInput)}>
                                {showPassword ? <i className="fa-regular fa-eye-slash fa-lg"></i> : <i className="fa-regular fa-eye fa-lg"></i>}    
                            </div> 
                        </div>
                        <label htmlFor="confirm" className="label">Confirm Password</label>
                        <div id="change-password-confirm" className="input">
                            <i className="fa-solid fa-lock fa-lg"></i>
                            <input ref={confirmPasswordInput} type="password" placeholder="Confirm Password..." name="password" value={confirmAdminPassword}
                                onChange={(e)=>setConfirmAdminPassword(e.target.value)} 
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"
                                required/>
                            <div id="toggle-password" onClick={()=>togglePassword(confirmPasswordInput)}>
                                {confirmshowPassword ? <i className="fa-regular fa-eye-slash fa-lg"></i> : <i className="fa-regular fa-eye fa-lg"></i>}    
                            </div> 
                        </div>
                    </div>
                : null}
                <ErrorBox error={profileError}/>
                <button disabled={loading} id="submit-button">Update Profile {loading ? <CSpinner style={{marginLeft:'10px'}}/>: null}</button>
            </form>
        </div>
    );
};