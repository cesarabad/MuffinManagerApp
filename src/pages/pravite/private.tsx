import { Navigate, Route } from "react-router-dom";
import { PrivateRoutes } from "../../models/routes";
import RoutesWithNotFound from "../../helpers/routes-with-not-found";
import { lazy } from "react";
import { useAuth } from "../../contexts/auth/auth.context";
import { Permission } from "../../models/auth/permisos.model";

const HomePage = lazy(() => import("./home.page"));
const ManageDataPage = lazy(() => import("./manage-data.page"));
const MuffinShapePage = lazy(() => import("./manage-data/shape-management/shape-management"));
const BoxPage = lazy(() => import("./manage-data/box-management/box-management.page"));

function Private() {
  const { hasPermission } = useAuth();
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={PrivateRoutes.HOME}/>} />

      <Route path={PrivateRoutes.HOME} element={<HomePage/>} />

      <Route 
        path={PrivateRoutes.MANAGE_DATA} 
        element={hasPermission(Permission.ManageData) ? <ManageDataPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
        path={PrivateRoutes.MANAGE_MUFFIN_SHAPE} 
        element={hasPermission(Permission.ManageData) && hasPermission(Permission.GetMuffinShapes) ? <MuffinShapePage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
        path={PrivateRoutes.MANAGE_BOX} 
        element={hasPermission(Permission.ManageData) && hasPermission(Permission.GetMuffinShapes) ? <BoxPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />
    </RoutesWithNotFound>
  );
}

export default Private;