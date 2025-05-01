import {Route, Routes} from "react-router-dom";
import NotFound from "../pages/NotFound.tsx";
import RegisterPage from "../pages/RegisterPage";

// Define route paths as constants to avoid typos and enable easier updates
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
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            
            {/* Public routes */}
            {/* TODO: Add home page route */}
            {/* <Route path={ROUTES.HOME} element={<HomePage />} /> */}
            
            {/* Catch all route for 404 */}
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
    );
}