import React from "react";
import {createRoot} from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import store from "./redux/store";
import ScrollToTop from "./scroll";
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