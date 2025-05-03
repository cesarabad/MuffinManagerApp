import { createContext, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import { LoginRequest } from "../../models/auth/login-request.model";
import { User } from "../../models/auth/user.model";
import { Permission } from "../../models/auth/permisos.model";
import { httpCrudService } from "../../services/http-crud.service";
import { RegisterRequest } from "../../models/auth/register-request.model";
import { toast } from "react-toastify";
import { t } from "i18next";
import { UpdateUserDto } from "../../models/auth/update-user-dto.model";

interface AuthContextType {
  user: User | null;
  isAuthenticated: () => boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  createUser: (userDto: RegisterRequest) => Promise<void>;
  saveUser: (user: User) => void;
  updateUser: (updatedUserDto: UpdateUserDto) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PATH = "/user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  const saveUser = (user: User) => {
    try {
      const expirationDate = new Date(decodeToken(user.token).exp * 1000);
      Cookies.set("user", JSON.stringify(user), {
        expires: expirationDate,
        secure: true,
        sameSite: "Strict",
      });
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const decodeToken = (token: string) => {
    try {
      const payload = token.split(".")[1];
      const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decodedPayload);
    } catch (error) {
      throw new Error("Invalid token format");
    }
  };

  const isTokenExpired = (token: string): boolean => {
    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  };


  const createUser = async (userDto: RegisterRequest) => {
    const response: User = await httpCrudService<User>(PATH).post("/register", userDto);
    if (response) {
      toast.success(t("profile.registerSuccess"));
    }
  }

  const getUser = (): User | null => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const user: User = JSON.parse(userCookie);
      if (isTokenExpired(user.token)) {
        logout(); // Token expired
        return null;
      }
      return user;
    }
    return null;
  };

  const login = async (request: LoginRequest) => {
    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const responseBody: User = await response.json();

      if (responseBody.token) {
        saveUser(responseBody);
      } else {
        throw new Error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    Cookies.remove("user");
    location.reload();
  };

  


  const updateUser = async (updatedUserDto: UpdateUserDto) => {
    const response: User = await httpCrudService<User>(PATH).post("/update", updatedUserDto);
    if (response.id) {
      saveUser(response);
      location.reload();
    }
  }

  const isAuthenticated = (): boolean => {
    return !!getUser();
  };

  const hasPermission = (permission: Permission): boolean => {
    const user = getUser();
    return (user?.permissions.includes(permission) || user?.permissions.includes(Permission.Dev) || user?.permissions.includes(Permission.SuperAdmin)) ?? false;
  };

  return (
    <AuthContext.Provider value={{ user: getUser(), isAuthenticated, login, logout, hasPermission, createUser, saveUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
