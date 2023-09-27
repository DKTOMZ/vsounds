import { CSpinner, CToaster } from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css';
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShippingOption } from "../../redux/store";
import getStripe from "../../stripe/getStripe";
import { useAuth } from "../../contexts/AuthContext";
import { UseToast } from "../utilities/Toast";

const PaymentSummary = (props) =>{
    const shippingMethod = useSelector((state)=>state.shipping.method);
    const [loadingStripe,setLoadingStripe] = useState(false);
    const [stripeError, setStripeError] = useState(0);
    const { currentUser } = useAuth();
    const dispatch = useDispatch();
    const cart = useSelector((state)=>state.cart);

    const handleStripeCheckout = async() => {
        setLoadingStripe(true);
        const stripe = await getStripe();
        let response = null; let data = null;
        
        try {
            response = await fetch(`${process.env.REACT_APP_PAYMENT_GATEWAY}/stripe-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({cart:cart,shipping:shippingMethod,userId:currentUser.uid})
            });
            if (response.status >= 200 && response.status <= 299) {data = await response.json();}
        } catch (error) {
            setStripeError(<UseToast message='Error connecting to stripe' />);
            setLoadingStripe(false);
            return console.log(error);
        }

        stripe.redirectToCheckout({sessionId: data.id});

    };

    return (
        <div id="shipping-payment">
            <CToaster placement="top-end" push={stripeError}/>
            <div id="shipping-summary">
                <h3 style={{marginBottom:'10px'}}>SHIPPING METHOD</h3>
                <div id="title-decoration" style={{marginBottom:'30px'}}></div>
                <div id="shipping-method">
                    <label>
                        <input type='radio' style={{marginRight: '10px'}}
                        onChange={(e)=>dispatch(setShippingOption(e.target.value))}
                        name="shipping" value='Free' checked={shippingMethod === 'Free'}/>
                        {'Standard (2-7 Business Days) - Free'}
                    </label>
                </div>
                <div id="shipping-method">
                    <label>
                        <input type='radio' style={{marginRight: '10px'}}
                        onChange={(e)=>dispatch(setShippingOption(e.target.value))}
                        name="shipping" value='5' checked={shippingMethod === '5'}/>
                        {'2 Business Days - $5'}
                    </label>
                </div>
                <div id="shipping-method">
                    <label>
                        <input type='radio' style={{marginRight: '10px'}}
                        onChange={(e)=>dispatch(setShippingOption(e.target.value))}
                        name="shipping" value='10' checked={shippingMethod === '10'}/>
                        {'Next Day - $10'}
                    </label>
                </div>
            </div>
            <div id="payment">
                <h3 style={{marginBottom:'10px'}}>PAYMENT</h3>
                <div id="title-decoration" style={{marginBottom:'30px'}}></div>
                <button onClick={handleStripeCheckout} style={{marginBottom:'20px'}} className="buttons" disabled={loadingStripe}>
                    <i style={{marginRight:'10px'}} className="fa-brands fa-stripe fa-2xl"></i> 
                    {loadingStripe ? <CSpinner style={{marginLeft:'10px'}}/>: null}
                </button>
                <p>
                    <i style={{marginRight:'10px', color:'#ffffff'}} className="fa-solid fa-circle-exclamation fa-xl"></i>
                    Don't use real cards, use
                    <a className="stripe-link" href="https://stripe.com/docs/testing#use-test-cards" rel="noreferrer" target="_blank">
                         stripe test cards 
                    </a>
                    when paying 
                </p>
            </div>
        </div>
    );
}

export const Payment = () => {
    const cart = useSelector((state)=>state.cart);
    const shippingFee = useSelector((state)=>state.shipping.method);
    
    return (

            <>
                {
                cart.length === 0 ? <h4 style={{color:'#1DB954',marginBottom:'80px'}}><i className="fa-solid fa-face-frown"></i> Add something to your cart then come back</h4>
                : <>
                        <div id="payment-page" style={{marginBottom:'20px'}}>
                            <PaymentSummary />
                            <div id="cart">
                            <h3 style={{marginBottom:'10px'}}>ORDER SUMMARY</h3>
                            <div id="title-decoration"></div>
                            <div style={{marginTop:'30px'}}></div>
                                {
                                    cart.map((value,index)=> {
                                        return <div key={value.name+value.imageurl_and_colors['color']} id="cart-card" style={{margin:'0',borderRadius:'0px'}}>
                                            <div id="product-image">
                                                <img style={{objectFit:'cover'}} src={value.imageurl_and_colors.img} alt={value.name}/>
                                            </div>
                                            <div id="product-details">
                                                <p id="product-name">{value.name}</p>
                                                <p id="product-category">{`${value.type} > ${value.category}`}</p>
                                                <p id="product-quantity">Qty: {value.quantity}</p>
                                                <p id="product-price2" style={{display:"block"}}>${value.price}</p>
                                            </div>
                                            <div id="product-price" style={{display:"none"}}>${value.price}</div>
                                        </div>
                                    })
                                }
                                <div id="price-and-total" style={{marginTop:'20px'}}>
                                    <div id="subtotal">
                                        <p id="label">Subtotal</p>
                                        <p id="value">${cart.reduce((total,value)=>total+parseInt(value.price),0)}</p>
                                    </div>
                                    <hr/>
                                    <div id="shipping">
                                        <p id="label">Shipping</p>
                                        <p id="value">{isNaN(shippingFee) ? shippingFee : `$${shippingFee}`}</p>
                                    </div>
                                    <hr />
                                    <div id="total">
                                        <p id="label">Total</p>
                                        <p id="value">${isNaN(shippingFee) ? cart.reduce((total,value)=>total+parseInt(value.price),0) : parseInt(shippingFee)+cart.reduce((total,value)=>total+parseInt(value.price),0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                </>
                }
            </>

    );
};