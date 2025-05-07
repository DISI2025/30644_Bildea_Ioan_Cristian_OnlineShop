import {Route, Routes} from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import RegisterPage from "../pages/RegisterPage";
import {HomePage} from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
    CART: "/cart",
    NOT_FOUND: "*"
} as const;

export default function AppRouter() {
    return (
        <Routes>
            {/* Auth routes */}
            <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
            <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>

            {/* Public routes */}
            {/* TODO: Add others page routes */}
            <Route path={ROUTES.HOME} element={<HomePage/>}/>

            {/* Catch all route for 404 */}
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage/>}/>
        </Routes>
    );
}