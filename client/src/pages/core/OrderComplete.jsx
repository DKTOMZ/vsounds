import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/store";
import { runSnow } from "../utilities/confetti";

export const OrderComplete = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(clearCart());
        runSnow();
        
    // eslint-disable-next-line
    },[]);

    return (
        <div className="success">
            <div className="content">
                <h4 style={{color:'#1DB954'}}>
                    <i className="fa-regular fa-circle-check fa-xl"></i>
                    <strong> Order successful!</strong>
                </h4>
                <p>Please check your email for order details</p>
                <p>Thank you for your supporting us.</p>
                <p> If you have other questions, please email 
                    <a style={{textDecoration:'none', color:'#fc9b2c'}} href="mailto:apptests.tomno@gmail.com"> apptests.tomno@gmail.com</a>
                </p>
                <button id="complete" className="buttons" onClick={()=>navigate('/',{replace:true})}>Continue Shopping</button>
            </div>
        </div>
    );
};