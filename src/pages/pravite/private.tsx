import { Navigate, Route } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../../models/routes";
import RoutesWithNotFound from "../../helpers/routes-with-not-found";
import { lazy, useEffect } from "react";
import { useAuth } from "../../contexts/auth/auth.context";
import { Permission } from "../../models/auth/permission.model";
import { connectWebSocket, useWebSocketListener } from "../../services/web-socket-listenner.service";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { WebSocketMessage } from "../../models/web-socket-message/web-socket-message.model";
import { User } from "../../models/index.model";

const HomePage = lazy(() => import("./home.page"));
const ManageDataPage = lazy(() => import("./manage-data.page"));
const MuffinShapePage = lazy(() => import("./manage-data/shape-management/shape-management"));
const BoxPage = lazy(() => import("./manage-data/box-management/box-management.page"));
const PackagePrintPage = lazy(() => import("./manage-data/package-print/package-print-management.page"));
const BaseProductItemPage = lazy(() => import("./manage-data/product-data-management/base-product-item/base-product-item-management.page"));
const ProductItemPage = lazy(() => import("./manage-data/product-data-management/product-item/product-item-management.page"));
const ProductPage = lazy(() => import("./manage-data/product-data-management/product/product-management.page"));
const StockPage = lazy(() => import("./stock/stock.page"));
const UserManagementPage = lazy(() => import("./user/user-management.page"));
const ProfilePage = lazy(() => import("./user/profile.page"));
const BrandPage = lazy(() => import("./manage-data/brand-management/brand-management.page"));
const ManageProductDataPage = lazy(() => import("./manage-data/product-data-management/product-data-management.page"));

function Private() {
  const { hasPermission, isAuthenticated, saveUser, user, logout} = useAuth();
  const { t } = useTranslation();

  const handleMessage = (message: string) => {
    try {
      const parsedMessage: WebSocketMessage = JSON.parse(message);
      toast.info(`${t(parsedMessage.dictionaryKey, { user: `${parsedMessage.user.name} ${parsedMessage.user.secondName}`})}`);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  useWebSocketListener(`/topic/global`, handleMessage);
  useWebSocketListener(`/topic/user/update/${user ? user.id : -1}`, (updatedUserJson: string) => {updatedUserJson === "deleted" ? logout() : saveUser(JSON.parse(updatedUserJson) as User)});

  useEffect(() => {
    connectWebSocket().catch((err) => {
      console.error("Error connecting websocket in Private:", err);
    });
  }, []);
    
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={PrivateRoutes.HOME}/>} />

      <Route path={PrivateRoutes.HOME} element={<HomePage/>} />

      <Route 
      path={PrivateRoutes.MANAGE_DATA} 
      element={hasPermission(Permission.GetData) || hasPermission(Permission.ManageData) ? <ManageDataPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
      path={PrivateRoutes.MANAGE_USERS} 
      element={hasPermission(Permission.ManageUsers) ? <UserManagementPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
      path={PrivateRoutes.MANAGE_MUFFIN_SHAPE} 
      element={(hasPermission(Permission.GetData) || hasPermission(Permission.ManageData)) ? <MuffinShapePage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
      path={PrivateRoutes.MANAGE_BOX} 
      element={(hasPermission(Permission.GetData) || hasPermission(Permission.ManageData)) ? <BoxPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route 
      path={PrivateRoutes.MANAGE_PACKAGE_PRINT} 
      element={(hasPermission(Permission.GetData) || hasPermission(Permission.ManageData)) ? <PackagePrintPage/> : <Navigate to={PrivateRoutes.HOME}/>}
      />

      <Route
      path={PrivateRoutes.MANAGE_BRANDS}
      element={(hasPermission(Permission.GetData) || hasPermission(Permission.ManageData)) ? <BrandPage /> : <Navigate to={PrivateRoutes.HOME} />}
      />

      <Route
      path={PrivateRoutes.MANAGE_PRODUCTS_DATA}
      element={(hasPermission(Permission.GetData) || hasPermission(Permission.ManageData)) ? <ManageProductDataPage /> : <Navigate to={PrivateRoutes.HOME} />}
      />

      <Route
      path={PrivateRoutes.MANAGE_BASE_PRODUCT_ITEM}
      element={(hasPermission(Permission.GetData) || hasPermission(Permission.ManageData)) ? <BaseProductItemPage /> : <Navigate to={PrivateRoutes.HOME} />}
      />

      <Route
      path={PrivateRoutes.MANAGE_PRODUCT_ITEM}
      element={(hasPermission(Permission.GetData) || hasPermission(Permission.ManageData)) ? <ProductItemPage /> : <Navigate to={PrivateRoutes.HOME} />}
      />

      <Route
      path={PrivateRoutes.MANAGE_PRODUCT}
      element={(hasPermission(Permission.GetData) || hasPermission(Permission.ManageData)) ? <ProductPage /> : <Navigate to={PrivateRoutes.HOME} />}
      />

      <Route
      path={PrivateRoutes.STOCK}
      element={hasPermission(Permission.ManageStock) || hasPermission(Permission.GetStock) ? <StockPage /> : <Navigate to={PrivateRoutes.HOME} />}
      />

      <Route
      path={PrivateRoutes.PROFILE}
      element={isAuthenticated() ? <ProfilePage /> : <Navigate to={PublicRoutes.LOGIN} />}
      />
      
      <Route
      path={`${PrivateRoutes.PROFILE}/:userId`}
      element={
        hasPermission(Permission.ManageUsers) 
        ? <ProfilePage /> 
        : <Navigate to={PrivateRoutes.HOME} />
      }
      />

    </RoutesWithNotFound>
  );
}

export default Private;