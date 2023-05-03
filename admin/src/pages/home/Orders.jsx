import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useSelector } from "react-redux";
import { updateOrder } from "../../sync";

export const Orders = () => {
    const orders = useSelector(state=>state.orders);
    const columns = [
        { field: 'date', headerName: 'Order Date', type: 'dateTime', width: 200},
        { field: 'id', headerName: 'ID', width: 200},
        { field: 'docid', headerName: 'docID'},
        { 
            field: 'status',
            headerName: 'Status', 
            width: 150, 
            renderCell: (params)=>{
                return (
                    <div style={ params.row.status !== 'PENDING' ? params.row.status === 'DISPATCHED' ? {color:'#77ffff'} : {color:'#77ff8e'} : {color:'#fc9b2c'}}>
                        {params.row.status}
                    </div>
                );
            }
        },
        { field: 'products', headerName: 'Products', width: 150},
        { field: 'total', headerName: 'Total',width: 150},
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 150,
            renderCell: (params)=>{
                return (
                    <>
                        {params.row.status !== 'PENDING' ?
                            params.row.status === 'DISPATCHED' ? <button onClick={()=>updateOrder({id: params.row.docid, deliveryStatus: 'delivered'})} className="product-table-btn">Delivered</button> : null
                         : <button onClick={()=>updateOrder({id: params.row.docid, deliveryStatus: 'dispatched'})} className="product-table-btn">Dispatch</button>}
                        <Link to={`/Order/?order=${encodeURIComponent(params.row.id)}`} style={{textDecoration:'none',color:'white'}} className="product-table-link">View</Link>
                    </>
                );
            }
        }
    ];
    const rows = orders.map((order,index)=>{
        return {
            date: new Date(order.timestamp),
            id: order.customerId,
            docid: order.id,
            status: order.deliveryStatus.toUpperCase(),
            products: order.products.length,
            total: parseInt(order.total),
        }
    });
    return (
        <div id="orders">
            <div id="title-decoration"></div>
            <h4>CUSTOMER ORDERS</h4>
            <br/>
            <p>Here are all existing orders. Feel to free to sort and filter using controls in the column headers</p>
            <div style={{ height: 450, marginBottom:'20px', width: '100%', fontFamily:'inherit'}}>
                <DataGrid
                sx={{
                    border: 2,
                    color: 'white',
                    '& .MuiCheckbox-root svg': {
                        color: 'white'
                    },
                    '& .MuiTablePagination-displayedRows': { color: 'white'},
                    '& .MuiTablePagination-actions': { color: 'white'},
                    '& .MuiIconButton-root': { color: 'white'},
                    '& .MuiDataGrid-row': { backgroundColor:'#1a232c'},
                    '& .MuiDataGrid-columnHeaders': { backgroundColor: '#141414'},
                    '& .MuiDataGrid-footerContainer': { backgroundColor: '#141414'},
                    '& .MuiDataGrid-columnHeadersInner': { fontSize: '16px', fontWeight: 'bold'},
                    '& .MuiDataGrid-row:hover': { backgroundColor:'#2b3846'},
                    '& .MuiDataGrid-cell': { fontSize:'14px'},
                    '& .MuiTablePagination-selectLabel': { color: 'white'},
                    '& .MuiInputBase-root': { color: 'white'},
                    '& .MuiTablePagination-selectIcon': { color: 'white'}
                }}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                    sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
                    columns: {
                        columnVisibilityModel: { docid: false},
                    },
                }}
                pageSizeOptions={[5, 10, 20]} 
                columns={columns}
                rows={rows}
                />
            </div>
        </div>
    );
};