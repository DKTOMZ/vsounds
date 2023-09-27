import { CAlert, CSpinner } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/store";
import { NotFound } from "../utilities/404";

export const Product = () => {
    const location = useLocation();
    const appData = useSelector(state=>state.appData[0]);
    const query = new URLSearchParams(location.search).get('name');
    const [cartMessage,setCartMessage] = useState('Item added to cart');
    const [cartMessageIcon,setCartMessageIcon] = useState('fa-regular fa-circle-check');
    const [product,setProduct] = useState({});
    const [itemExists,setItemExists] = useState(false);
    const [itemAdded,setItemAdded] = useState(false);
    const cart = useSelector(state=>state.cart); 
    const [activeImgColor,setActiveImgColor] = useState({});
    const [loading,setLoading] = useState(true);
    const [notFound,setNotFound] = useState('loading');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // eslint-disable-next-line
    useEffect(()=>{loadData();},[appData,query]);

    // eslint-disable-next-line
    useEffect(()=>{checkCart();},[cart,activeImgColor]);

    const loadData = () => {
        if (appData) {
            const filter = appData.filter((value)=>value.name === query);
            cart.forEach((value,index)=>{
                if (value.name === filter[0].name) {return setItemExists(true);}
            });
            if (filter.length > 0) { 
                setProduct(filter[0]);
                setActiveImgColor(filter[0].imageurl_and_colors[0]);
                setLoading(false);
            }
            else {
                setNotFound('Not found');
            }
        } 
    };

    const checkCart = () => {
        setItemExists(false);
        cart.forEach((value,index)=>{
            if (value.name === product.name){
                if (value.imageurl_and_colors['color'] === activeImgColor['color']) {return setItemExists(true);}
            }
        });
    };

    const addItem = () => {
        if (cart.length > 8) {
            setCartMessage('Cart is full.');
            setCartMessageIcon('fa-regular fa-circle-xmark');
            setItemAdded(true);
            return;
        }
        const newProduct = {
            name: product.name,
            type: product.type,
            category: product.category,
            stock: product.stock,
            price: product.price,
            quantity: 1,
            imageurl_and_colors: activeImgColor,
            link: `${location.pathname}${location.search}`
        };
        dispatch(addToCart(newProduct));
        setItemAdded(true);
    };

    return (
        <>
            {!loading ?
                <div id="product">
                <div id="product-title"></div>
                <div id="title-decoration"></div>
                <h3>{product.name}</h3>
                <div className="product-info">
                    <div className="info">
                        <div className="images-colors">
                            <img className="active" height={500} style={{objectFit: "cover"}} width="100%" src={activeImgColor.img} alt={product.name}/>
                            <br />
                            <div className="colors">
                                {product.imageurl_and_colors.map((value,index)=>{
                                    return <div style={{backgroundColor:`${value.color}`, border: value.color === activeImgColor.color ? '2px solid #1DB954' : '2px solid #cccaca', borderRadius:'50%', height:'50px', width:'50px'}} key={index} onClick={()=>setActiveImgColor(value)} className="preview-color" src={value.color}></div>
                                })}
                            </div>
                        </div>
                        <div className="price">
                            <div className="price-actual">${product.price}</div>
                            {product.stock > 0 ? 
                            <div>
                                <div className="stock">
                                    <i className="fa-solid fa-layer-group fa-lg"></i>
                                    <div className="text">IN STOCK</div>
                                </div>
                                <div className="text">Available to buy and ship</div>
                                {itemAdded ? <CAlert color={ cartMessage === 'Item added to cart'?"success":'danger'}>
                                    <div><i style={{marginRight:'10px'}} className={cartMessageIcon}></i> {cartMessage}</div>
                                </CAlert> : null}
                                {itemExists 
                            ?
                            <>
                                <button className="buttons" onClick={()=> {navigate('/Cart');}}>GO TO CART</button>
                            </>
                            :
                            <button className="buttons" onClick={()=> {
                                addItem();
                            }
                            }>ADD TO CART</button>
                            }
                            </div>
                            : <div className="text" style={{color:'red'}}><i className="fa-solid fa-layer-group fa-lg"></i> OUT OF STOCK</div>}
                        </div>
                        <div className="text">
                            <div className="brand-details"><h4>Brand:</h4><span className="brand">{product.brand}</span></div>
                            <div className="intro"><div className="txt">{product.short_desc}</div></div>
                            <div className="specs">
                                <div id="title-decoration"></div>
                                <h3>Specs</h3>
                                {product.specs.split(/[\n+.]/).map((value,index)=>{
                                return <div key={index} className="txt">{value}</div> 
                                })}
                            </div>
                            <div className="features">
                                <div id="title-decoration"></div>
                                <h3>Features</h3>
                                <div className="txt">{product.features}</div>
                            </div>
                        </div>
                    </div>
                    <div className="price">
                        <div className="price-actual">${product.price}</div>
                        {product.stock > 0 ? 
                        <div>
                            <div className="stock">
                                <i className="fa-solid fa-layer-group fa-lg"></i>
                                <div className="text">IN STOCK</div>
                            </div>
                            <div className="text">Available to buy and ship</div>
                            {itemAdded ? <CAlert color={ cartMessage === 'Item added to cart'?"success":'danger'}>
                                    <div><i style={{marginRight:'10px'}} className={cartMessageIcon}></i> {cartMessage}</div>
                                </CAlert> : null}
                            {itemExists 
                            ?
                            <>
                                <button className="buttons" onClick={()=> {navigate('/Cart');}}>GO TO CART</button>
                            </>
                            :
                            <button className="buttons" onClick={()=> {
                                addItem();
                            }
                            }>ADD TO CART</button>
                            }
                        </div>
                        : <div className="text" style={{color:'red'}}>OUT OF STOCK</div>}
                    </div>
                </div>
            </div>
            : notFound === 'loading' ? <CSpinner color="success"/> : <NotFound/>}
        </>
    );
};
