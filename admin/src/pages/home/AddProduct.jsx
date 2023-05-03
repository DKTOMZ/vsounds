import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { addProducts } from "../../sync";
import { UseModal } from "../utilities/Modal";
import { ErrorBox } from "../utilities/Error";
import { useAuth } from "../../contexts/AuthContext";
import { InputGroup } from "../utilities/InputGroup";
import { clearImgColors, removeImgColors } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";

export const AddProduct = () => {
    const {currentAdmin} = useAuth();
    const [productName,setProductName] = useState('');
    const [productBrand,setProductBrand] = useState('');
    const [productFeatures,setProductFeatures] = useState('');
    const [productSpecs,setProductSpecs] = useState('');
    const [productShortDesc,setProductShortDesc] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productError, setProductError] = useState('');
    const [productSuccess,setProductSuccess] = useState(false);
    const [productStock,setProductStock] = useState('');
    const [InputGroups,setInputGroups] = useState([<InputGroup key={0}/>]);
    const productForm = useRef();
    const dispatch = useDispatch();
    const imgUrlColors = useSelector(state=>state.imgColors);

    const clearError = () => setProductError('');


    useEffect(()=>{
        dispatch(clearImgColors());
    },[]);
    
    const addInputGroup = () => {
        setInputGroups([...InputGroups,<InputGroup key={InputGroups.length}/>]);
    };

    const removeInputGroup = (index) => {
        if (InputGroups.length > 1) {
            setInputGroups([...InputGroups.slice(0,index),...InputGroups.slice(index+1)]);
            dispatch(removeImgColors({index: index}));
        }
    };

    const types = [
        {name: 'Guitar'},
        {name: 'Accessory'}
    ];

    const accessoryCategories = [
        {name: 'Amps'},
        {name: 'Capos'},
        {name: 'Pedals'},
        {name: 'Picks'},
        {name: 'Strings'}
    ];

    const guitarCategories = [
        {name: 'Acoustic'},
        {name: 'Bass'},
        {name: 'Electric'}
    ];

    const [currentType,setCurrentType] = useState(types[0].name);
    const [currentCategory,setCurrentCategory] = useState(guitarCategories[0].name);

    const addProduct = async(e) => {
        e.preventDefault();
        clearError();
        const product = {
            uid: currentAdmin.uid,
            name: productName.trim(),
            brand: productBrand,
            type: currentType,
            category: currentCategory,
            shortDesc: productShortDesc,
            features: productFeatures,
            specs: productSpecs,
            imageurl_and_colors: imgUrlColors,
            price: productPrice,
            stock: productStock,
            timestamp: Date.now()
        }
        const addProduct = await addProducts(product);
        if (addProduct) {setProductError(addProduct.error);}
        else {
            dispatch(clearImgColors());
            setProductSuccess(true);
        }
    };

    return (
        <div id="add-product">
            {productSuccess ? <UseModal reload title="Success!" body='Your Product has been added successfully' buttonText='Close'/> : null}
            <h2>Add a product</h2>
            <form ref={productForm} id="product-form" onSubmit={addProduct}>
                <label htmlFor="ProductName" className="label">Name</label>
                <div id="product-name" className="input">
                    <i className="fa-solid fa-guitar fa-lg"></i>
                    <input type="text" placeholder="Product Name..." name="ProductName" value={productName} onChange={(e)=>setProductName(e.target.value)} required/>
                </div>
                <label htmlFor="product-brand" className="label">Brand</label>
                <div id="product-brand" className="input">
                    <i className="fa-solid fa-copyright fa-lg"></i>
                    <input type="text" placeholder="Product Brand..." name="ProductBrand" value={productBrand} onChange={(e)=>setProductBrand(e.target.value)} required/>
                </div>
                <label htmlFor="input-dropdown" className="label">Type</label>
                <select id="types" onChange={(e)=>setCurrentType(e.target.value)}>
                    {types.map((value)=><option key={value.name} value={value.name}>{value.name}</option>)}
                </select>
                {currentType === 'Guitar'
                ?
                <>
                    <label htmlFor="category" className="label">Category</label>
                    <select id="category" name="category" onChange={(e)=>setCurrentCategory(e.target.value)}>
                        {guitarCategories.map((value)=><option key={value.name} value={value.name}>{value.name}</option>)}
                    </select>
                </>
                :
                <>
                    <label htmlFor="category" className="label">Category</label>
                    <select id="category" name="category" onChange={(e)=>setCurrentCategory(e.target.value)}>
                        {accessoryCategories.map((value)=><option key={value.name} value={value.name}>{value.name}</option>)}
                    </select>
                </>
                }
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
                <button id="submit-button">Add product</button>
            </form>
        </div>
    );
};