import React from "react";
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./scroll";
import { App } from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { Provider } from "react-redux";
import store from "./redux/store";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />
                <App />
            </BrowserRouter>
        </AuthProvider>
    </Provider>
);