import { createSlice, configureStore, createListenerMiddleware, isAnyOf} from "@reduxjs/toolkit";

const cartInitialState = JSON.parse(localStorage.getItem('cart')) || null;

const appDataSlice = createSlice({
    name: 'appData',
    initialState: [],
    reducers: {
        setAppData: (state,action)=>{return [action.payload]}
    }
});

const shippingSlice = createSlice({
    name:'shipping',
    initialState: {method:'Free'},
    reducers: {
        setShippingOption: (state,action)=>{state.method = action.payload}
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: cartInitialState ? cartInitialState.cart : [],
    reducers: {
        addToCart: (state,action)=>{return [...state,action.payload]},
        updateQuantity: (state,action)=>{
            return state.map((value,index)=>{
                if (index === action.payload.index && action.payload.newValue > 0 && action.payload.newValue <= value.stock) {
                    return {...value,price:(value.price/value.quantity)*action.payload.newValue,quantity:action.payload.newValue}
                }
                return value;
            });
        },
        removeFromCart : (state,action)=>{
            return [...state.slice(0,action.payload),...state.slice(action.payload+1)]
        },
        clearCart: (state,action)=>{ return []}
    }
});


const userOrdersSlice = createSlice({
    name: 'userOrders',
    initialState: [],
    reducers: {
        setUserOrders: (state,action)=>{return action.payload}
    }
});

export const { setUserOrders } = userOrdersSlice.actions;

export const { setShippingOption } = shippingSlice.actions;

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export const { setAppData } = appDataSlice.actions;


export const listenerMiddleWare = createListenerMiddleware();

listenerMiddleWare.startListening({
    matcher: isAnyOf(addToCart,updateQuantity,removeFromCart,clearCart),
    effect: (action,listenerApi) => {
        try {
            localStorage.setItem('cart', JSON.stringify(listenerApi.getState()));
        } catch (error) {
            console.log(error);
        }
        return;
    }
});

export default configureStore({
    reducer: {
        appData: appDataSlice.reducer,
        cart: cartSlice.reducer,
        shipping: shippingSlice.reducer,
        userOrders: userOrdersSlice.reducer
    },
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(listenerMiddleWare.middleware) 
});