import { restErrorHandler } from "../services/error-handler.service";

// http.utils.ts
export const handleResponseError = async (response: Response) => {
    let error: any = {};
    try {
      error = await response.json();
    } catch {
      error.message = "Error inesperado del servidor";
    }
  
    restErrorHandler(error);
    throw new Error(error.message || "Error desconocido");
  };
  