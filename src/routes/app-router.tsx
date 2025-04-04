import {  Route, Navigate } from "react-router-dom";
import Layout from "../components/app/layout/layout.component";
import { PrivateRoutes, PublicRoutes } from "../models/routes";
import AuthGuard from "../guards/auth.guard";
import RoutesWithNotFound from "../helpers/routes-with-not-found";
import { lazy } from "react";

const LoginPage = lazy(() => import("../pages/public/login.page"));
const Private = lazy(() => import("../pages/pravite/private"));
export const AppRouter = () => {
  
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={PrivateRoutes.PRIVATE}/>}/>

      <Route element={<Layout showMenu={false} />}>
        <Route path={PublicRoutes.LOGIN} element={<LoginPage />} />
      </Route>

      
      <Route element={<Layout showMenu={true} />}>
        <Route element ={<AuthGuard />}>
          <Route path={`${PrivateRoutes.PRIVATE}/*`} element={<Private/>} /> 
        </Route>
      </Route>
    </RoutesWithNotFound>
  );
};

export default AppRouter;
