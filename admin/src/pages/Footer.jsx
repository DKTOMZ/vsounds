import React from "react";
import logo from '../assets/logo.png';

export const Footer = () => {
    return (
        <div id="Footers">
            <div id="logo" name='logo'><img src={logo} height={50} width={120} alt="logo"/></div>
            <div id="footer">
                <hr/>
                <p>© Created by Dennis Tomno</p>
            </div>
        </div>
    );
}; 