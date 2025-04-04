import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../models/routes";
import { User } from "../models/index.model";

export const AuthGuard = () => {
  // Obtener usuario desde las cookies
  const userCookie = Cookies.get("user");
  const user: User | null = userCookie ? JSON.parse(userCookie) : null;

  if (!user || !user.token) {
    return <Navigate replace to={PublicRoutes.LOGIN} />;
  }

  return <Outlet />;
};

export default AuthGuard;
