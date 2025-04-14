import { Navigate, Route } from "react-router-dom";
import { PrivateRoutes } from "../../models/routes";
import RoutesWithNotFound from "../../helpers/routes-with-not-found";
import { lazy } from "react";
import { useAuth } from "../../contexts/auth/auth.context";
import { Permission } from "../../models/auth/permisos.model";
import { useWebSocketListener } from "../../services/web-socket-listenner.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { WebSocketMessage } from "../../models/web-socket-message/web-socket-message.model";

const HomePage = lazy(() => import("./home.page"));
const ManageDataPage = lazy(() => import("./manage-data.page"));
const MuffinShapePage = lazy(() => import("./manage-data/shape-management/shape-management"));
const BoxPage = lazy(() => import("./manage-data/box-management/box-management.page"));
const PackagePrintPage = lazy(() => import("./manage-data/package-print/package-print-management.page"));

function Private() {
  const { hasPermission } = useAuth();
  const { t } = useTranslation();

  const handleMessage = (message: string) => {
    try {
      console.log("Received WebSocket message:", message);
      const parsedMessage: WebSocketMessage = JSON.parse(message);
      toast.info(`${t(parsedMessage.dictionaryKey, { user: `${parsedMessage.user.name} ${parsedMessage.user.secondName}`})}`);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  useWebSocketListener(`/topic/global`, handleMessage);
    
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={PrivateRoutes.HOME}/>} />

      <Route path={PrivateRoutes.HOME} element={<HomePage/>} />

      <Route 
        path={PrivateRoutes.MANAGE_DATA} 
        element={(hasPermission(Permission.ManageData) || hasPermission(Permission.GetData)) ? <ManageDataPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
        path={PrivateRoutes.MANAGE_MUFFIN_SHAPE} 
        element={hasPermission(Permission.GetMuffinShapes) ? <MuffinShapePage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
        path={PrivateRoutes.MANAGE_BOX} 
        element={hasPermission(Permission.GetBoxes) ? <BoxPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
        path={PrivateRoutes.MANAGE_PACKAGE_PRINT} 
        element={hasPermission(Permission.GetPackagePrints) ? <PackagePrintPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />
    </RoutesWithNotFound>
  );
}

export default Private;