import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import store, { setImgColors, updateImgColors } from "../../redux/store";

export const InputGroup = (props) => {
    const [productImg,setProductImg] = useState( props.hasOwnProperty('data') ?  props.data.img : '');
    const [productColor,setProductColor] = useState(  props.hasOwnProperty('data') ?  props.data.color : '#1DB954');
    let index = useRef(0);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setImgColors({data:{img:productImg,color:productColor}}));
        index.current = store.getState().imgColors.length-1;
    },[]);

    return (
        <>
            <div id="image-color" name="Image-Color">
                <div id="product-img" className="input">
                    <i className="fa-solid fa-image fa-lg"></i>
                    <input type="url" placeholder="Image url..." name="ProductImg" value={productImg} onChange={
                        (e)=>{
                            setProductImg(e.target.value);
                            dispatch(updateImgColors({data:{img:e.target.value,color:productColor},index:index.current}));
                        }
                    } required/>
                </div>
                <div id="product-color" className="input">
                    <i className="fa-solid fa-palette fa-lg"></i>
                    <input type="color" name="ProductColor" value={productColor} onChange={
                        (e)=>{
                            setProductColor(e.target.value);
                            dispatch(updateImgColors({data:{img:productImg,color:e.target.value},index:index.current}));
                        }
                    } 
                    required/>
                </div>
            </div>
            <div>
                <img src={productImg} style={{objectFit:'cover'}} height={150} width={150} alt='preview'/>
            </div>
            <br/>
        </>
            
    );
};
