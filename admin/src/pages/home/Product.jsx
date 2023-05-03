import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { UseModal } from "../utilities/Modal";
import { ErrorBox } from "../utilities/Error";
import { InputGroup } from "../utilities/InputGroup";
import { clearImgColors, removeImgColors } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { NotFound } from "../utilities/404";
import { CSpinner } from "@coreui/react";
import { updateProducts } from "../../sync";

export const Product = () => {
    const products = useSelector(state=>state.products);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('product');
    const [product,setProduct] = useState({});
    const [loading,setLoading] = useState(true);
    const [notFound,setNotFound] = useState('loading'); 
    const [productFeatures,setProductFeatures] = useState('');
    const [productSpecs,setProductSpecs] = useState('');
    const [productShortDesc,setProductShortDesc] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productError, setProductError] = useState('');
    const [productSuccess,setProductSuccess] = useState(false);
    const [productStock,setProductStock] = useState('');
    const [InputGroups,setInputGroups] = useState([<InputGroup key={0}/>]);
    const [isupdated,setIsUpdated] = useState(true);
    const productForm = useRef();
    const dispatch = useDispatch();
    const imgUrlColors = useSelector(state=>state.imgColors);

    useEffect(()=>{
        if (products.length > 0) {
            const filter = products.filter((product)=>product.name===query);
            if (filter.length > 0) { 
                setProduct(filter[0]);
                setProductFeatures(filter[0].features);
                setProductSpecs(filter[0].specs);
                setProductShortDesc(filter[0].short_desc);
                setProductPrice(filter[0].price);
                setProductStock(filter[0].stock);
                setInputGroups(filter[0].imageurl_and_colors.map((value,index)=><InputGroup key={index} data={value}/>));
                setLoading(false);
            }
            else {
                setNotFound('Not found');
            }
        }
    },[products]);


    const clearError = () => setProductError('');

    const addInputGroup = () => {
        setInputGroups([...InputGroups,<InputGroup key={InputGroups.length}/>]);
    };

    const removeInputGroup = (index) => {
        if (InputGroups.length > 1) {
            setInputGroups([...InputGroups.slice(0,index),...InputGroups.slice(index+1)]);
            dispatch(removeImgColors({index: index}));
        }
    };

    const updateProduct = async(e) => {
        e.preventDefault();
        setIsUpdated(false);
        clearError();
        const productUpdate = {
            id: product.id,
            name: product.name,
            shortDesc: productShortDesc,
            features: productFeatures,
            specs: productSpecs,
            imageurl_and_colors: imgUrlColors,
            price: productPrice,
            stock: productStock,
            timestamp: Date.now()
        }
        const updatedProduct = await updateProducts(productUpdate);
        if (updatedProduct) {setProductError(updatedProduct.error);}
        else {
            dispatch(clearImgColors());
            setIsUpdated(true);
            setProductSuccess(true);
        }
    };

    return (
        <>
            { !loading ? 
                    <div id="update-product">
                    {productSuccess ? <UseModal title="Success!" body='Your Product has been updated successfully' buttonText='Close'/> : null}
                    <h2>Update Product</h2>
                    <form ref={productForm} id="product-form" onSubmit={updateProduct}>
                        <label htmlFor="ProductName" className="label">Name</label>
                        <div id="product-name" className="input">
                            <i className="fa-solid fa-guitar fa-lg"></i>
                            <input type="text" readOnly name="ProductName" value={product.name} required/>
                        </div>
                        <label htmlFor="product-brand" className="label">Brand</label>
                        <div id="product-brand" className="input">
                            <i className="fa-solid fa-copyright fa-lg"></i>
                            <input type="text" readOnly name="ProductBrand" value={product.brand} required/>
                        </div>
                        <label htmlFor="product-type" className="label">Type</label>
                        <div id="product-type" className="input">
                            <input type="text" readOnly name="ProductType" value={product.type} required/>
                        </div>
                        <label htmlFor="product-category" className="label">Category</label>
                        <div id="product-category" className="input">
                            <input type="text" readOnly name="ProductCategory" value={product.category} required/>
                        </div>
                        <label htmlFor="ProductShortDesc" className="label">Short description</label>
                        <div id="product-short-desc" className="input">
                            <textarea placeholder="Description..." name="ProductShortDesc" value={productShortDesc} onChange={(e)=>setProductShortDesc(e.target.value)}required/>
                        </div>
                        <label htmlFor="ProductFeatures" className="label">Features</label>
                        <div id="product-features" className="input">
                            <textarea placeholder="Features..." name="ProductFeatures" value={productFeatures} onChange={(e)=>setProductFeatures(e.target.value)}required/>
                        </div>
                        <label htmlFor="ProductSpecs" className="label">Specs</label>
                        <div id="product-specs" className="input">
                            <textarea placeholder="Separate each spec with a fullstop" name="ProductSpecs" value={productSpecs} onChange={(e)=>setProductSpecs(e.target.value)}required/>
                        </div>
                        <label htmlFor="Image-Color" className="label">Image urls and Product Colors</label>
                        {InputGroups.map((value,index)=>{
                            return <div key={index} style={{marginBottom:'40px'}}>
                                {value}
                                {index > 0 ? 
                                    <div id="modify-groups" style={{marginBottom:'0'}}>
                                        <button style={{backgroundColor:'rgb(218, 55, 55)'}} className="product-table-btn" onClick={
                                            (e)=>{
                                                e.preventDefault();
                                                removeInputGroup(index);
                                            }
                                        }>Remove group</button>
                                    </div>
                                : null}
                            </div> 
                        })}
                        <div id="modify-groups" style={{marginTop:'10px'}}>
                            <button className="product-table-btn" onClick={
                                (e)=>{
                                    e.preventDefault();
                                    addInputGroup();
                                }
                            }>Add group</button>
                        </div>
                        <label htmlFor="ProductStock" className="label">Stock</label>
                        <div id="product-stock" className="input">
                            <i className="fa-solid fa-layer-group fa-lg"></i>
                            <input type="number" min={0} placeholder="Stock..." name="ProductStock" value={productStock} onChange={(e)=>setProductStock(e.target.value)} required/>
                        </div>
                        <label htmlFor="ProductPrice" className="label">Price</label>
                        <div id="product-price" className="input">
                            <i className="fa-solid fa-money-bill-1 fa-lg"></i>
                            <input type="number" min={0} placeholder="Price..." name="ProductPrice" value={productPrice} onChange={(e)=>setProductPrice(e.target.value)} required/>
                        </div>
                        <ErrorBox error={productError}/>
                        <button id="submit-button" disabled={!isupdated}>Update product {!isupdated ? <CSpinner style={{marginLeft:'10px'}}/> : null}</button>
                    </form>
                </div>
                : notFound === 'loading' ? <CSpinner color="success"/> :<NotFound/>
            }
        </>
    );
};