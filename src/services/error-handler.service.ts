
import { ErrorResponse } from "../models/error-response/error-response.model";
export const restErrorHandler = (error: ErrorResponse) => {
    //toast.error(error.message);

    console.error("Error:", error);
}