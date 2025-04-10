
import { toast } from "react-toastify";
import { ErrorResponse } from "../models/error-response/error-response.model";
export const restErrorHandler = (error: ErrorResponse) => {
    toast.error(error.message);
}