import { CButton, CCard, CCardBody, CCardImage, CCardText, CCardTitle, CCarousel, CSpinner } from "@coreui/react";
import { CImage } from "@coreui/react";
import { CCarouselItem } from "@coreui/react";
import { CCarouselCaption } from "@coreui/react";
import React from "react";
import '@coreui/coreui/dist/css/coreui.min.css';
import '../../App.scss';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const Home  = () => {

    const navigate = useNavigate();
    const appData = useSelector((state)=>state.appData.length > 0 ? state.appData[0] : state.appData);
    const newArrivals = appData.length > 0 ? [...appData].sort((a,b)=>{return b.timestamp - a.timestamp}).slice(0,5) : [];

    const featured = appData.length > 0 ? [
        appData.filter((value)=>value.category==='Acoustic').sort((a,b)=>{return b.timestamp - a.timestamp})[0],
        appData.filter((value)=>value.category==='Bass').sort((a,b)=>{return b.timestamp - a.timestamp})[0],
        appData.filter((value)=>value.category==='Electric').sort((a,b)=>{return b.timestamp - a.timestamp})[0],
        appData.filter((value)=>value.category==='Amps').sort((a,b)=>{return b.timestamp - a.timestamp})[0],
        appData.filter((value)=>value.category==='Pedals').sort((a,b)=>{return b.timestamp - a.timestamp})[0],
    ] : [];

    const categories = [
        {name:'Acoustic', imageLink:'https://www.ikmultimedia.com/products/st3americanacoustic/main-banner/mobile.jpg'},
        {name:'Electric', imageLink:'https://cdn.mos.cms.futurecdn.net/Yh6r74b8CAj2jbdf2FAhq4.jpg'},
        {name:'Bass', imageLink:'https://cdn.mos.cms.futurecdn.net/nLMvc7uR32HLfjq7fwtUQX.jpg'},
        {name:'Amps', imageLink:'https://www.bassgearmag.com/wp-content/uploads/2022/03/Katana.jpg'},
    ];

    const accessories = [
        {name:'Strings', imageLink:'https://i.pinimg.com/originals/b3/2f/5c/b32f5cced19018e3501ff39304a1e4d6.jpg'},
        {name:'Picks', imageLink:'https://cen.acs.org/content/dam/cen/99/45/WEB/09945-newscripts-picks-social.jpg'},
        {name:'Capos', imageLink:'https://blog.sweelee.com/uploads/2021/10/sweelee_blog_best_guitar_capos_buyers_guide_kyser_capos_1-1024x1024.jpg'},
        {name:'Pedals', imageLink:'https://www.adorama.com/alc/wp-content/uploads/2017/08/shutterstock_584510992.jpg'}
    ];
    return (
        <>
            {
                appData.length > 0 ?
                    <div id="Home">
                        <div id="carousel">
                            <div id="category-title">
                                <div id="title-decoration"></div>
                                <h3>FEATURED</h3>
                            </div>
                            {featured.length > 0 ?
                            <CCarousel controls indicators interval={3000} transition="slide">
                                {featured.map((value)=>{
                                        return <CCarouselItem key={value.name}>
                                            <CImage height={450} style={{filter:'brightness(60%)', objectFit:"contain"}} className="d-block w-100 cimage" src={value.imageurl_and_colors[0].img} alt={value.name} />
                                            <CCarouselCaption className="d-md-block">
                                                <CButton className="cbutton" onClick={()=>navigate(`product/?name=${encodeURIComponent(value.name)}`)}>{value.name}</CButton>
                                                <p>{value.short_desc}</p>
                                            </CCarouselCaption>
                                        </CCarouselItem>
                                })}
                            </CCarousel>
                            : <CSpinner color="success"/>}
                        </div>
                        <div id="category-title">
                                <div id="title-decoration"></div>
                                <h3>CATEGORIES</h3>
                        </div>
                        <div id="categories">
                            {categories.map((value)=>{
                                return <Link style={{textDecoration:'none'}} className="Card" key={value.name} to={`category/?name=${value.name}`} >
                                    <CCard color="dark" textColor="white">
                                        <CCardImage orientation="top" height={270} style={{filter:'brightness(90%)', objectFit:"cover"}} src={value.imageLink} alt={value.name}/>
                                        <CCardBody>
                                            <CCardTitle>{value.name}</CCardTitle>
                                        </CCardBody>
                                    </CCard>
                                </Link>
                            })}
                        </div>
                        <div id="category-title">
                                <div id="title-decoration"></div>
                                <h3>NEW ARRIVALS</h3>
                        </div>
                        <div id="new-arrivals">
                            {newArrivals.length > 0 ?
                            newArrivals.map((value)=>{
                                return <Link style={{textDecoration:'none'}} key={value.name} to={`/product/?name=${encodeURIComponent(value.name)}`}>
                                    <CCard key={value.name} className="Card" color="dark" textColor="white">
                                        <CCardImage orientation="top" height={270} style={{filter:'brightness(90%)', objectFit:"cover"}} src={value.imageurl_and_colors[0].img} alt={value.name}/>
                                        <CCardBody>
                                            <CCardTitle>{value.name}</CCardTitle>
                                            <CCardText>${value.price}</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </Link>
                            }):<CSpinner color="success"/>}
                        </div>
                        <div id="category-title">
                                <div id="title-decoration"></div>
                                <h3>ACCESSORIES</h3>
                        </div>
                        <div id="accessories">
                            {accessories.map((value)=>{
                                return <Link style={{textDecoration:'none'}} key={value.name} to={`accessory/?name=${value.name}`}>
                                    <CCard key={value.name} className="Card" color="dark" textColor="white">
                                        <CCardImage orientation="top" height={270} style={{filter:'brightness(90%)', objectFit:"cover"}} src={value.imageLink} alt={value.name}/>
                                        <CCardBody>
                                            <CCardTitle>{value.name}</CCardTitle>
                                        </CCardBody>
                                    </CCard>
                                </Link>
                                
                            })}
                        </div>
                    </div>
                : <CSpinner color="success"/>
            }
        </>
    );
};