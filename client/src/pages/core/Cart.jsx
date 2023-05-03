import React from "react";
import '@coreui/coreui/dist/css/coreui.min.css';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../../redux/store";

export const Cart = () => {
    const cart = useSelector(state=>state.cart);
    const shippingFee = useSelector((state)=>state.shipping.method); 
    const dispatch = useDispatch();
    
    return (
        <div id="cart-page">
                    {cart.length > 0 ?
                    <div id="cart-and-pricing">
                        <div id="cart">
                            <h2>Your shopping basket</h2>
                        {
                                cart.map((value,index)=> {
                                    return <div key={value.name+value.imageurl_and_colors['color']} id="cart-card">
                                        <i id="remove-card" onClick={()=>dispatch(removeFromCart(index))} className="fa-solid fa-xmark fa-lg"></i>
                                        <div id="product-image">
                                            <img style={{objectFit:'cover'}} src={value.imageurl_and_colors.img} alt={value.name}/>
                                        </div>
                                        <div id="product-details">
                                            <Link to={`/product/?name=${encodeURIComponent(value.name)}`} id="product-name">{value.name}</Link>
                                            <p id="product-category">{`${value.type} > ${value.category}`}</p>
                                            <p id="product-category">In stock: <span style={{color:'white'}}>{value.stock}</span></p>
                                            <p id="product-price2">${value.price}</p>
                                            <div id="product-controls">
                                                <div id="decrease" onClick={()=>{dispatch(updateQuantity({index:index,newValue:value.quantity-1}))}}><i className="fa-solid fa-minus"></i></div>
                                                <div id="quantity">{value.quantity}</div>
                                                <div id="increase" onClick={()=>{dispatch(updateQuantity({index:index,newValue:value.quantity+1}))}}><i className="fa-solid fa-plus"></i></div>
                                            </div>
                                        </div>
                                        <div id="product-price">${value.price}</div>
                                    </div>
                                })
                        }
                        </div>
                        <div id="price-and-total">
                            <h2>Order summary</h2>
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
                                <p id="value">${ isNaN(shippingFee) ? cart.reduce((total,value)=>total+parseInt(value.price),0) : parseInt(shippingFee)+cart.reduce((total,value)=>total+parseInt(value.price),0)}</p>
                            </div>
                            <Link id="checkout" to="/Payment"><button id="submit-button"><i style={{marginRight:'10px',marginBottom:'5px',fontSize:'18px'}} className="fa-solid fa-lock"></i> Checkout</button></Link>
                    </div>
                    </div>
                     : <h4 style={{color:'#1DB954',marginBottom:'80px'}}><i className="fa-solid fa-face-frown"></i> Nothing here. Add some items</h4>}
        </div>
    );
};