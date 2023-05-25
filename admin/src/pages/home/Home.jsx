import React from "react";
import { useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";

const getTimeDiff = (timestamp) => {
    let today = new Date();
    let orderDate = new Date(timestamp);
    let timeYears = Math.abs(new Date(today.getTime()-orderDate.getTime()).getFullYear()-1970);
    let timeMonths = today.getMonth()-orderDate.getMonth()+12*(today.getFullYear()-orderDate.getFullYear());
    let timeDays = Math.round(Math.abs(today.getTime() - orderDate.getTime()) / (24 * 60 * 60 * 1000));
    let timeHours = Math.round(Math.abs(today.getTime() - orderDate.getTime()) / (60 * 60 * 1000));
    let timeMins = Math.round(Math.abs(today.getTime() - orderDate.getTime()) / (60 * 1000));
    let timeSecs = Math.round(Math.abs(today.getTime() - orderDate.getTime()) / (1000));
    if (timeSecs < 60) { 
        if (timeSecs < 2) { return timeSecs+' sec' }
        else { return timeSecs+' secs' }
    }
    else if (timeMins < 60) { 
        if (timeMins < 2) { return timeMins+' min' }
        else { return timeMins+' mins' }
    }
    else if (timeHours < 24) { 
        if (timeHours < 2) { return timeHours+' hour' }
        else { return timeHours+' hours' }
    }
    else if (timeDays < 32) {
        if (timeDays < 2) { return timeDays+' day' }
        else { return timeDays+' days' }
    }
    else if (timeMonths < 13) {
        if (timeMonths < 2) { return timeMonths+' month' }
        else { return timeMonths+' months' }
    }
    else {
        if (timeYears < 2) { return timeYears+' year' }
        else { return timeYears+' years' }
    }
};

export const Home = () => {
    const users = {};
    const orders = useSelector(state=>state.orders);
    orders.forEach((order)=>users[order.userId]=order.userId);
    const totalUsers = Object.keys(users).length;
    //const products = useSelector(state=>state.products);

    const monthProductsSold = orders.filter((order)=>new Date(order.timestamp).getMonth()===new Date(Date.now()).getMonth()).reduce((total,order)=>total+order.products.length,0);
    const previousMonthProductsSold = orders.filter((order)=>new Date(order.timestamp).getMonth()===(new Date(Date.now()).getMonth()-1 >= 0 ? new Date(Date.now()).getMonth()-1 : new Date(Date.now()).getMonth())).reduce((total,order)=>total+order.products.length,0);
    const percentChangeProducts = previousMonthProductsSold ? ((monthProductsSold-previousMonthProductsSold)/previousMonthProductsSold) * 100 : 0;
    
    const monthOrders = orders.filter((order)=>new Date(order.timestamp).getMonth()===new Date(Date.now()).getMonth()).length;
    const previousMonthOrders = orders.filter((order)=>new Date(order.timestamp).getMonth()===(new Date(Date.now()).getMonth()-1 >= 0 ? new Date(Date.now()).getMonth()-1 : new Date(Date.now()).getMonth())).length;
    const percentChangeOrders = previousMonthOrders ? ((monthOrders-previousMonthOrders)/previousMonthOrders) * 100 : 0;
    
    const monthEarnings = orders.filter((order)=>new Date(order.timestamp).getMonth()===new Date(Date.now()).getMonth()).reduce((total,order)=>total+order.total,0);
    const previousMonthEarnings = orders.filter((order)=>new Date(order.timestamp).getMonth()===(new Date(Date.now()).getMonth()-1 >= 0 ? new Date(Date.now()).getMonth()-1 : new Date(Date.now()).getMonth())).reduce((total,order)=>total+order.total,0);
    const percentChangeEarnings = previousMonthEarnings ? ((monthEarnings-previousMonthEarnings)/previousMonthEarnings) * 100 : 0;
    
    const numberToDay = (num) => {
        switch (num) {
            case 0:
                return 'Sun'
            case 1:
                return 'Mon'
            case 2:
                return 'Tue'
            case 3:
                return 'Wed'
            case 4:
                return 'Thu'
            case 5:
                return 'Fri'
            case 6:
                return 'Sat'
            default:
                break;
        }
    };

    let today = new Date();

    today.setDate(today.getDate())
    let startDate = today.getDate();
    let startDay = today.getDay();

    today.setDate(today.getDate()-1)
    let startDate1 = today.getDate();
    let startDay1 = today.getDay();

    today.setDate(today.getDate()-1)
    let startDate2 = today.getDate();
    let startDay2 = today.getDay();

    today.setDate(today.getDate()-1);
    let startDate3 = today.getDate();
    let startDay3 = today.getDay();

    today.setDate(today.getDate()-1);
    let startDate4 = today.getDate();
    let startDay4 = today.getDay();

    today.setDate(today.getDate()-1);
    let startDate5 = today.getDate();
    let startDay5 = today.getDay();

    today.setDate(today.getDate()-1);
    let startDate6 = today.getDate();
    let startDay6 = today.getDay();

    let days = {
        [startDate]:{day:numberToDay(startDay),date:startDate, total: 0},
        [startDate1]:{day:numberToDay(startDay1),date:startDate1, total: 0},
        [startDate2]:{day:numberToDay(startDay2),date:startDate2, total: 0},
        [startDate3]:{day:numberToDay(startDay3),date:startDate3, total: 0},
        [startDate4]:{day:numberToDay(startDay4),date:startDate4, total: 0},
        [startDate5]:{day:numberToDay(startDay5),date:startDate5, total: 0},
        [startDate6]:{day:numberToDay(startDay6),date:startDate6, total: 0},
    };

    const weeklyEarnings = orders.filter((order)=>(
    (new Date() - new Date(order.timestamp)) / (1000 * 60 * 60 * 24) <= 6
    )).sort((a,b)=>a.timestamp-b.timestamp);    

    weeklyEarnings.forEach((earning)=>{
        if (days.hasOwnProperty(new Date(earning.timestamp).getDate())) {
            days[new Date(earning.timestamp).getDate()].day = numberToDay(new Date(earning.timestamp).getDay());
            days[new Date(earning.timestamp).getDate()].total += earning.total;
        }
    });

    return (
        <div id="home">
            <div id="title-decoration"></div>
            <h4>WELCOME TO THE ADMIN DASHBOARD</h4>
            <br/>
            <div className="content">
                <div className="overviews">
                    <div id="title-decoration"></div>
                    <h4>OVERVIEW</h4>
                    <div className="monthly-overview">
                        <h5>Monthly</h5>
                        <p style={{fontSize:'14px'}} className="info">Your shop's performance this month. Percentages are calculated based on comparison 
                            with previous month
                        </p>
                        <div className="categories">
                            <div className="category">
                                <div className="icon"><i className="fa-solid fa-square-check fa-xl"></i></div>
                                <div className="details">
                                    <p className="value">
                                        {monthProductsSold}
                                    </p>
                                    <span className="percent" style={percentChangeProducts >= 0 ? {color: '#159943'}: {color:'rgb(252, 46, 46)'}}>
                                            {percentChangeProducts >= 0 ? '+'+percentChangeProducts.toFixed(0)+'%' : percentChangeProducts.toFixed(0)+'%'}
                                    </span>
                                    <p className="title">Products</p>
                                </div>
                            </div>
                            <div className="category">
                                <div className="icon"><i className="fa-solid fa-clipboard fa-2xl"></i></div>
                                <div className="details">
                                    <p className="value">
                                        {monthOrders}
                                    </p>
                                    <span className="percent" style={percentChangeOrders >= 0 ? {color: '#159943'}: {color:'rgb(252, 46, 46)'}}>
                                        {percentChangeOrders >= 0 ? '+'+percentChangeOrders.toFixed(0)+'%' : percentChangeOrders.toFixed(0)+'%'}
                                    </span>
                                    <p className="title">Orders</p>
                                </div>
                            </div>
                            <div className="category">
                                <div className="icon"><i className="fa-solid fa-money-bill fa-xl"></i></div>
                                <div className="details">
                                    <p className="value">
                                        ${monthEarnings}
                                    </p>
                                    <span className="percent" style={percentChangeEarnings >= 0 ? {color: '#159943'}: {color:'rgb(252, 46, 46)'}}>
                                        {percentChangeEarnings >= 0 ? '+'+percentChangeEarnings.toFixed(0)+'%' : percentChangeEarnings.toFixed(0)+'%'}
                                    </span>
                                    <p className="title">Earnings</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overview">
                        <h5>All-time</h5>
                        <p style={{fontSize:'14px'}} className="info">Your shop's performance since it first opened.
                        </p>
                        <div className="categories">
                            <div className="category">
                                <div className="icon"><i className="fa-solid fa-users fa-xl"></i></div>
                                <div className="details">
                                    <p className="value">{totalUsers}</p>
                                    <p className="title">Customers</p>
                                </div>
                            </div>
                            <div className="category">
                                <div className="icon"><i className="fa-solid fa-clipboard fa-2xl"></i></div>
                                <div className="details">
                                    <p className="value">{orders.length}</p>
                                    <p className="title">Orders</p>
                                </div>
                            </div>
                            <div className="category">
                                <div className="icon"><i className="fa-solid fa-money-bill fa-xl"></i></div>
                                <div className="details">
                                    <p className="value">${orders.reduce((total,order)=>total+order.total,0)}</p>
                                    <p className="title">Earnings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sales-chart">
                        <div id="title-decoration"></div>
                        <h4>SALES - RECENT</h4>
                        <ReactApexChart
                        series={
                            [
                                {
                                    name: 'Earnings',
                                    data: [
                                        days[startDate6].total, 
                                        days[startDate5].total, 
                                        days[startDate4].total, 
                                        days[startDate3].total, 
                                        days[startDate2].total, 
                                        days[startDate1].total, 
                                        days[startDate].total
                                    ]
                                }
                            ]
                        }
                        options={{
                            chart: {
                                type: 'line',
                                toolbar: {
                                    show: false,
                                },
                                height: 400,
                                width: '100%',
                                zoom: {
                                    enabled: false
                                },
                                foreColor: '#ffffff'
                            },
                            markers: {
                                size: 5,
                                showNullDataPoints:true,
                                hover: {
                                    sizeOffset: 3
                                }
                            },
                            dataLabels: {
                                enabled: false
                            },
                            stroke: {
                                curve: 'smooth',
                                colors: ['#1DB954'],
                                width: 3,
                                show: true
                            },
                            title: {
                                text: 'Earnings($) - Last 7 days',
                                align: 'center',
                                style:{color:'white',fontSize:'18px'}
                            },
                            xaxis: {
                                categories: [
                                    days[startDate6].day+' '+days[startDate6].date,
                                    days[startDate5].day+' '+days[startDate5].date,
                                    days[startDate4].day+' '+days[startDate4].date,
                                    days[startDate3].day+' '+days[startDate3].date, 
                                    days[startDate2].day+' '+days[startDate2].date, 
                                    days[startDate1].day+' '+days[startDate1].date, 
                                    days[startDate].day+' '+days[startDate].date,
                                ]
                            }
                        }}
                        />
                    </div>
                </div>
                <div className="inventory-and-recent">
                    <div className="recent">
                        <div id="title-decoration"></div>
                        <h4>RECENT ORDERS</h4>
                        <div className="orders">
                            {[...orders].sort((a,b)=>{return b.timestamp - a.timestamp}).slice(0,5).map((order,index)=>{
                                return <div key={index} className="order">
                                    <p className="name">{order.shipping.name}</p>
                                    <p className="amt">${order.total}</p>
                                    <p className="time">{getTimeDiff(order.timestamp)} ago</p>
                                </div>
                            })}
                        </div>
                    </div>
                            {
                                /*  
                                    <div id="title-decoration"></div> 
                                    <h4>ALL PRODUCTS </h4>
                                    <div className="inventory"> 
                                        <div className="accessories">
                                            <ReactApexChart
                                                type='donut'
                                                height={370}
                                                width={370}
                                                series={[
                                                    products.filter((product)=>product.category === 'Amps').length,
                                                    products.filter((product)=>product.category === 'Capos').length,
                                                    products.filter((product)=>product.category === 'Pedals').length,
                                                    products.filter((product)=>product.category === 'Picks').length,
                                                    products.filter((product)=>product.category === 'Strings').length
                                                ]}
                                                options={
                                                    {
                                                        labels: ['Amps','Capos','Pedals','Picks','Strings'],
                                                        title: {text:'Accessories',align:'center',style:{color:'white',fontSize:'18px'}},
                                                        legend: {
                                                            position:'bottom',
                                                            labels: { colors: ['white']}
                                                        },
                                                        plotOptions: {
                                                            pie: {
                                                                donut: {
                                                                    labels: {
                                                                        show: true,
                                                                        total: {
                                                                            show: true,
                                                                            color: 'white',
                                                                            label: 'Total',
                                                                            fontSize: '16px'
                                                                        },
                                                                        value: {
                                                                            color: 'white'
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                />
                                            </div>
                                            <br/>
                                            <div className="guitars">
                                            <ReactApexChart
                                                type='donut'
                                                height={370}
                                                width={370}
                                                series={[
                                                    products.filter((product)=>product.category === 'Acoustic').length,
                                                    products.filter((product)=>product.category === 'Bass').length,
                                                    products.filter((product)=>product.category === 'Electric').length,
                                                ]}
                                                options={
                                                    {
                                                        labels: ['Acoustic','Bass','Electric'],
                                                        title: {text:'Guitars',align:'center',style:{color:'white',fontSize:'18px'}},
                                                        legend: {
                                                            position:'bottom',
                                                            labels: { colors: ['white']}
                                                        },
                                                        plotOptions: {
                                                            pie: {
                                                                donut: {
                                                                    labels: {
                                                                        show: true,
                                                                        total: {
                                                                            show: true,
                                                                            color: 'white',
                                                                            label: 'Total',
                                                                            fontSize: '16px'
                                                                        },
                                                                        value: {
                                                                            color: 'white'
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                />
                                        </div>
                                    </div>
                                */
                            }
                </div>
            </div>
        </div>
    );
};