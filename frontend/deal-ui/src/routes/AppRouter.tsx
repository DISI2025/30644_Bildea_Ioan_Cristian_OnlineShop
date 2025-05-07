import {Route, Routes} from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage.tsx";
import RegisterPage from "../pages/RegisterPage";
import {HomePage} from "../pages/HomePage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.tsx";
import PrivateRoute from "./ProtectedRoute.tsx";
import AdminRoute from "./AdminRoute.tsx";

export const ROUTES = {
   HOME: "/home",
   LOGIN: "/login",
   REGISTER: "/register",
   FORGOT_PASSWORD: "/forgot-password",
   RESET_PASSWORD: "/reset-password",
   PRODUCTS: "/products",
   CATEGORIES: "/categories",
   CART: "/cart",
   // Todo: update this
   ADMIN_ROUTE: "/admin",
   NOT_FOUND: "*"
} as const;

export default function AppRouter() {
   return (
      <Routes>
         <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
         <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
         <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage/>}/>
         <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage/>}/>

         <Route path={ROUTES.HOME} element={<PrivateRoute><HomePage/></PrivateRoute>}/>
         <Route path={ROUTES.ADMIN_ROUTE} element={
            <AdminRoute>
               <div>Respect, atmine</div>
            </AdminRoute>
         }/>

         {/* Catch all route for 404 */}
         <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage/>}/>
      </Routes>
   );
}