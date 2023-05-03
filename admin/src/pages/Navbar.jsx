import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import { useAuth } from "../contexts/AuthContext";
import { UseDropdown } from "./utilities/Dropdown";
import { UseModal } from "./utilities/Modal";

export const NavBar = () => {
    const {logOutAdmin,currentAdmin} = useAuth();
    const [logOutErrorMsg,setLogOutErrorMsg] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div id="Nav">
            {logOutErrorMsg ? <UseModal title="Logout Error!" body={logOutErrorMsg} buttonText='Close' route={location.pathname}/> : null}
            <div id="navbar" name="navigation-bar">
                <Link to="/" id="logo" name='logo'><img src={logo} height={50} width={120} alt="logo"/></Link>
                <div id="menu">
                    {currentAdmin && location.pathname !== '/Login'
                    ? 
                    <UseDropdown child1={{text:currentAdmin.email}} 
                    child2={{text:'Profile', route:'/Profile'}}
                    child3={{text:'Add Product', route:'/Addproduct'}} 
                    child4={{text:'Logout', route: async()=>{
                        navigate('/',{replace: true});
                        const logOutResponse = await logOutAdmin();
                        if (logOutResponse) {
                            setLogOutErrorMsg(logOutResponse.error);
                        }
                    }}}/>
                    : <div>
                        <Link className="button" to="/Login">Login</Link>
                        <Link className="button" to="/Signup">Signup</Link>
                    </div>
                    }
                </div>
            </div>
            <div id="space"></div>
        </div>
    );
};