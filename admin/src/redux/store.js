import { createSlice, configureStore } from "@reduxjs/toolkit";

const imgColorsSlice = createSlice({
    name: 'imgColors',
    initialState: [],
    reducers: {
        setImgColors: (state,action)=>{return [...state,action.payload.data]},
        clearImgColors: (state,action)=>{ return []},
        updateImgColors: (state,action)=>{return [...state.slice(0,action.payload.index),action.payload.data,...state.slice(action.payload.index+1)]},
        removeImgColors: (state,action)=>{return [...state.slice(0,action.payload.index),...state.slice(action.payload.index+1)]}
    }
});

export const {setImgColors,clearImgColors,updateImgColors,removeImgColors} = imgColorsSlice.actions;

const productsSlice = createSlice({
    name: 'products',
    initialState: [],
    reducers: {
        setProducts: (state,action)=>{return action.payload}
    }
});

export const {setProducts} = productsSlice.actions;

const ordersSlice = createSlice({
    name: 'orders',
    initialState: [],
    reducers: {
        setOrders: (state,action)=>{return action.payload}
    }
});

export const {setOrders} = ordersSlice.actions;

const usersSlice = createSlice({
    name: 'users',
    initialState: 0,
    reducers: {
        setUsersCount: (state,action)=>{return action.payload}
    }
});

export const {setUsersCount} = usersSlice.actions;

export default configureStore({
    reducer: {
        imgColors: imgColorsSlice.reducer,
        products: productsSlice.reducer,
        orders: ordersSlice.reducer,
        users: usersSlice.reducer
    }
});