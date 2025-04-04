import {  Route, Navigate } from "react-router-dom";
import Layout from "../components/app/layout/layout.component";
import { PrivateRoutes, PublicRoutes } from "../models/routes";
import AuthGuard from "../guards/auth.guard";
import RoutesWithNotFound from "../helpers/routes-with-not-found";
import { lazy } from "react";
import { useAuth } from "../contexts/auth/auth.context";

const LoginPage = lazy(() => import("../pages/public/login.page"));
const Private = lazy(() => import("../pages/pravite/private"));
export const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={PrivateRoutes.PRIVATE}/>}/>

      <Route element={<Layout/>}>
      
        <Route path={PublicRoutes.LOGIN} element={isAuthenticated() ? <Private/> : <LoginPage />} />

        <Route element ={<AuthGuard />}>
          <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<Private/>} /> 
        </Route>
        
      </Route>
    </RoutesWithNotFound>
  );
};

export default AppRouter;
