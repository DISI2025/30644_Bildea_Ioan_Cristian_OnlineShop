import {ReactNode} from "react";
import {useSelector} from "react-redux";
import {AuthState, selectAuthState} from "../store/slices/auth-slice.ts";
import {Navigate, useLocation} from 'react-router-dom';
import {ROUTES} from "./AppRouter.tsx";

type ProtectedRouteProps = {
   children: ReactNode,
}

export default function PrivateRoute({children}: ProtectedRouteProps) {
   const authState: AuthState = useSelector(selectAuthState);
   const location = useLocation();

   return (
      authState.loggedIn ?
         <>{children}</> :
         <Navigate to={`${ROUTES.LOGIN}?from=${location.pathname}${location.search}`} replace={true}/>
   );
}