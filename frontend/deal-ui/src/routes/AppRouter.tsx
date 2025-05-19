import {Route, Routes} from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import RegisterPage from "../pages/RegisterPage";
import {HomePage} from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.tsx";
import PrivateRoute from "./ProtectedRoute.tsx";
import AdminRoute from "./AdminRoute.tsx";
import ProductCategoryManagerPage from "../pages/ProductCategoryManagerPage.tsx";
import {JSX} from "react";
import ProductManagerPage from "../pages/ProductManagerPage.tsx";

export const ROUTES = {
    INDEX: "/",
    HOME: "/home",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    PRODUCTS: "/products",
    PRODUCT_CATEGORIES: "/product-categories",
    CART: "/cart",
    ADMIN_ROUTE: "/admin",
    NOT_FOUND: "*"
} as const;

export default function AppRouter(routes: JSX.Element = <><Routes>
    <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
    <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage/>}/>
    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage/>}/>

    <Route path={ROUTES.HOME} element={<PrivateRoute><HomePage/></PrivateRoute>}/>
    <Route path={ROUTES.INDEX} element={<PrivateRoute><HomePage/></PrivateRoute>}/>
    <Route path={ROUTES.INDEX} element={<PrivateRoute><ProductManagerPage/></PrivateRoute>}/>

    <Route path={ROUTES.PRODUCT_CATEGORIES} element={<AdminRoute><ProductCategoryManagerPage/></AdminRoute>}/>

    <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage/>}/>
</Routes></>) {

    return routes;
}