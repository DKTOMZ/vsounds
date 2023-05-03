import { CCard, CCardBody, CCardImage, CCardText, CCardTitle, CSpinner } from "@coreui/react";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { NotFound } from "../utilities/404";

export const Accessory = () => {
    const location = useLocation();
    const appData = useSelector(state=>state.appData[0]);
    const query = new URLSearchParams(location.search).get('name');
    const [products,setProducts] = useState([]);
    const [loading,setLoading] = useState(true);
    const [notFound,setNotFound] = useState('loading');
    const [pageCount,setPageCount] = useState(1);

    useEffect(()=>{
        loadData();
    },[appData,query]);

    useEffect(()=>{window.scrollTo(0,0);},[pageCount]);

    const loadData = () => {
        if (appData) {
            const filter = appData.filter((value)=>value.category === query);
            if (filter.length > 0) { 
                setProducts(filter);
                setLoading(false);
            }
            else {
                setNotFound('Not found');
            }
        } 
    };

    return (
        <>
            {!loading ?
                        <div id="accessory">
                        <div id="accessory-title"></div>
                        <div id="title-decoration"></div>
                        <h3>{query}</h3>
                        <div className="accessories">
                            {
                            products.filter((product,index)=>(index >= ((pageCount*10)-10) && index < pageCount*10)).map((value)=>{
                                return <Link style={{textDecoration:'none'}} className="Card" key={value.name} to={`/product/?name=${encodeURIComponent(value.name)}`}>
                                    <CCard color="dark"  textColor="white">
                                        <CCardImage orientation="top" height={300} style={{filter:'brightness(80%)', objectFit: "cover"}} src={value.imageurl_and_colors[0].img || value.imageurl_and_colors[0].productImg} alt={value.name}/>
                                        <CCardBody>
                                                <CCardTitle style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{value.name}</CCardTitle>
                                                <CCardText>{value.brand}</CCardText>
                                                <CCardText>${value.price}</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </Link>
                            })}
                        </div>
                        <Pagination onChange={(e,p)=>setPageCount(p)} count={Math.ceil(products.length/10)} color="primary"/>
                    </div>
            : notFound === 'loading' ? <CSpinner color="success"/> : <NotFound/>}
        </>
    );
};
