import React from "react";
import { useSelector } from "react-redux";
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import { deleteProduct } from "../../sync";

export const Products = () => {
    const products = useSelector(state=>state.products);
    const columns = [
        { field: 'id', headerName: 'ID', width: 200},
        { field: 'brand', headerName: 'Brand', width: 150},
        { field: 'name', headerName: 'Name', width: 200},
        { field: 'price', headerName: 'Price'},
        { field: 'stock', headerName: 'Stock'},
        { field: 'category', headerName: 'Category',width: 150},
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 150,
            renderCell: (params)=>{
                return (
                    <>
                        <button onClick={()=>deleteProduct(params.row.id)} className="product-table-btn">Delete</button>
                        <Link style={{textDecoration:'none',color:'white'}} to={`/Product/?product=${encodeURIComponent(params.row.name)}`} className="product-table-link">View</Link>
                    </>
                );
            }
        },
        { field: 'date', headerName: 'Last update', type: 'dateTime', width: 200},
    ];
    const rows = products.map((product,index)=>{
        return {
            id: product.id,
            brand: product.brand,
            name: product.name,
            price: parseInt(product.price),
            stock: parseInt(product.stock),
            category: product.category,
            date: new Date(product.timestamp),
        }
    });
    return (
        <div id="products">
            <div id="title-decoration"></div>
            <h4>MY PRODUCTS</h4>
            <br/>
            <p>Here are all your products. Feel to free to sort and filter using controls in the column headers</p>
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
                        columnVisibilityModel: { id: false},
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