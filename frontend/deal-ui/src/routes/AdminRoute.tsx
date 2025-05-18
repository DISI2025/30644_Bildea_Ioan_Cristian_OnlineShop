import {ReactNode} from "react";
import {useSelector} from "react-redux";
import {AuthState, selectAuthState} from "../store/slices/auth-slice.ts";
import {Navigate} from 'react-router-dom';
import {ROUTES} from "./AppRouter.tsx";
import {UserRole} from "../types/entities.ts";

type AdminRouteProps = {
   children: ReactNode,
}

export default function AdminRoute({children}: AdminRouteProps) {
   const authState: AuthState = useSelector(selectAuthState);

   return (
      authState.loggedIn && authState.user?.role === UserRole.ADMIN ?
         <>{children}</> :
         <Navigate to={ROUTES.NOT_FOUND} replace={true}/>
   );
}