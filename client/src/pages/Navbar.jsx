import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import { useAuth } from "../contexts/AuthContext";
import { UseDropdown } from "./utilities/Dropdown";
import { UseModal } from "./utilities/Modal";

export const NavBar = () => {
    const {logOutUser,currentUser} = useAuth();
    const [logOutErrorMsg,setLogOutErrorMsg] = useState(null);
    const [searchQuery,setSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const cartLength = useSelector(state=>state.cart.length);
    const appData = useSelector((state)=>state.appData.length > 0 ? state.appData[0] : state.appData);

    return (
        <div id="Nav">
            {logOutErrorMsg ? <UseModal title="Logout Error!" body={logOutErrorMsg} buttonText='Close' route={location.pathname}/> : null}
            <div id="navbar" name="navigation-bar">
                <div id="main">
                    <Link to="/" id="logo" name='logo'><img src={logo} height={50} width={120} alt="logo"/></Link>
                    <div id="search-box">
                        <input type="text" onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} placeholder="Search a guitar..." id="search-input" name="search-input"/>
                        {appData.length > 0 && searchQuery !== '' ?
                            <div className="results">
                                    {
                                    appData.filter((product)=>product.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product,index)=>{
                                        return <div key={index} className="result"> 
                                            <Link onClick={()=>setSearchQuery('')} to={`/product/?name=${encodeURIComponent(product.name)}`}>
                                                {product.name}
                                            </Link>
                                        </div>
                                    })
                                    }
                            </div>
                        : null}
                    </div>
                    <div id="menu">
                        {currentUser 
                        ?  
                        <UseDropdown child1={{text:currentUser.email}} 
                        child2={{text:'Profile', route:'/Profile'}}
                        child3={{text:'My orders', route:'/UserOrders'}} 
                        child4={{text:'Logout', route: async()=>{
                            navigate('/',{replace: true});
                            const logOutResponse = await logOutUser();
                            if (logOutResponse) {
                                setLogOutErrorMsg(logOutResponse.error);
                            }
                        }}}/>
                        : <>
                            <Link className="button" to="/Login">Login</Link>
                        </>
                        }
                        <Link title="cart" className="button" to="/Cart">
                            <i className="fa-solid fa-cart-shopping fa-lg"></i>
                            {cartLength > 0 ? 
                            <div className="items-number">{cartLength}</div>
                            : null}
                        </Link>
                    </div>
                </div>
                <div id="search-box2">
                        <input type="text" onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery} placeholder="Search a guitar..." id="search-input" name="search-input"/>
                        {appData.length > 0 && searchQuery !== '' ?
                            <div className="results2">
                                    {
                                    appData.filter((product)=>product.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product,index)=>{
                                        return <div key={index} className="result2"> 
                                            <Link onClick={()=>setSearchQuery('')} to={`/product/?name=${encodeURIComponent(product.name)}`}>
                                                {product.name}
                                            </Link>
                                        </div>
                                    })
                                    }
                            </div>
                        : null}
                </div>
            </div>
            <div id="space"></div>
        </div>
    );
};