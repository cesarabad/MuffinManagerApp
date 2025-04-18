import Cookies from "js-cookie";
import { handleResponseError } from "../helpers/error-handler.helper";

const API_URL = "http://localhost:8080";

// Función para obtener headers actualizados
const getHeaders = () => {
  const user = Cookies.get("user");
  const token = user ? JSON.parse(user).token : null;

  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
};

export const httpCrudService = <T>(endpoint: string) => ({
  // GET
  get: async (path: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}${path}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) await handleResponseError(response);
    return response.body ? response.json() : Promise.resolve({} as T);
    },

    post: async <TBody>(path: string, body: Partial<TBody>): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}${path}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) await handleResponseError(response);
    return response.headers.get("Content-Length") !== "0" ? response.json() : {} as T;
    },

  // PUT
  put: async (path: string, body: Partial<T>): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}${path}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`PUT failed: ${response.status}`);
    return response.json();
  },

  // DELETE
  delete: async (path: string): Promise<void> => {
    const response = await fetch(`${API_URL}${endpoint}${path}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) throw new Error(`DELETE failed: ${response.status}`);
  },

    // PATCH
    patch: async (path: string, body?: Partial<T>): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}${path}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify(body ?? {}),
        });

        if (!response.ok) throw new Error(`PATCH failed: ${response.status}`);
        return response.json();
    }
});
