import React from "react";
import "./App.scss";
import { Navigate, Route, Routes } from "react-router-dom";
import { Footer } from "./pages/Footer";
import { Home } from "./pages/home/Home";
import { NavBar } from "./pages/Navbar";
import { Login } from "./pages/auth/Login";
import { SignUp } from "./pages/auth/Signup";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { useAuth } from "./contexts/AuthContext";
import { NotFound } from "./pages/utilities/404";
import { AdminProfile } from "./pages/auth/Profile";
import { AddProduct } from "./pages/home/AddProduct";
import { Orders } from "./pages/home/Orders";
import { Products } from "./pages/home/Products";
import { Product } from "./pages/home/Product";
import { Order } from "./pages/home/Order";

const ProtectedRoute = ({ children }) => {
    const {currentAdmin} = useAuth();
    if (!currentAdmin) { return <Navigate to='/Login' replace/> }
    return children;
};

const UnprotectedRoute = ({ children, props }) => {
    return children;
};

export const App = () => {
    return (
        <div id="App">
            <NavBar />
            <Routes>
                <Route index path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
                }/>
                <Route index path="Addproduct" element={
                <ProtectedRoute>
                    <AddProduct />
                </ProtectedRoute>
                }/>
                <Route path="Profile" element={
                <ProtectedRoute>
                    <AdminProfile />
                </ProtectedRoute>
                }/>
                <Route path="Products" element={
                    <ProtectedRoute>
                    <Products />
                </ProtectedRoute>
                }/>
                <Route index path="Product/?" element={
                <ProtectedRoute>
                    <Product />
                </ProtectedRoute>
                }/>
                <Route path="Orders" element={
                    <ProtectedRoute>
                    <Orders />
                </ProtectedRoute>
                }/>
                <Route index path="Order/?" element={
                <ProtectedRoute>
                    <Order />
                </ProtectedRoute>
                }/>
                <Route path="Login" element={
                <UnprotectedRoute props={{initial:'Login'}}>
                    <Login />
                </UnprotectedRoute>
                }    
                />
                <Route path="Signup" element={
                    <UnprotectedRoute>
                    <SignUp />
                </UnprotectedRoute>
                }/>
                <Route path="ResetPassword" element={
                    <UnprotectedRoute>
                    <ResetPassword />
                </UnprotectedRoute>
                }/>
                <Route path="*" element={<NotFound />}/>
            </Routes>
            <Footer />
        </div>
    );
};