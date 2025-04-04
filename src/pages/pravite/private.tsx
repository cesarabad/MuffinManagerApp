import { Navigate, Route } from "react-router-dom";
import { PrivateRoutes } from "../../models/routes";
import RoutesWithNotFound from "../../helpers/routes-with-not-found";
import { lazy } from "react";
import ManageDataPage from "./manage-data";

const HomePage = lazy(() => import("./home.page"));
const DashboardPage = lazy(() => import("./dashboard.page"));

function Private() {
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={PrivateRoutes.HOME}/>} />
      <Route path={PrivateRoutes.HOME} element={<HomePage/>} />
      <Route path={PrivateRoutes.DASHBOARD} element={<DashboardPage/>} />
      <Route path={PrivateRoutes.MANAGE_DATA} element={<ManageDataPage/>} />
    </RoutesWithNotFound>
  );
}

export default Private;