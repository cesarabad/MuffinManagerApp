import { httpCrudService } from "../http-crud.service";
const PATH = "/stock/check-stock"

export const checkStockService = {
    
    getPath: () => PATH,

    create: async () => {
        return await httpCrudService<void>(PATH).post("/create", {});
    },

    forceCreate: async () => {
        return await httpCrudService<void>(PATH).post("/forceCreate", {});
    },

    cancel: async () => {
        return await httpCrudService<void>(PATH).post("/cancel", {});
    }

}