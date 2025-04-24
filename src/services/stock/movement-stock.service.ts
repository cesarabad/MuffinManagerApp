import { MovementStock } from "../../models/stock/movement-stock/reserve-dto.model";
import { httpCrudService } from "../http-crud.service";
const PATH = "/stock/movement-stock"

export const movementStockService = {
    getHistoricByProductId: async (productId: number) => {
        return await httpCrudService<MovementStock>(PATH).get(`/getHistoricByProductId/${productId}`);
    },

    getHistoricByProductStockId: async (productStockId: number) => {
        return await httpCrudService<MovementStock>(PATH).get(`/getHistoricByProductStockId/${productStockId}`);
    },

    getHistoric: async () => {
        return await httpCrudService<MovementStock>(PATH).get("/getHistoric");
    },

    insert: async (model: MovementStock) => {
        return await httpCrudService<MovementStock>(PATH).post("/insert", model);
    },

    undoMovement: async (movementStockId: number) => {
        return await httpCrudService<MovementStock>(PATH).post(`/undoMovement/${movementStockId}`, {});
    },

    endReserve: async (movementStockId: number) => {
        return await httpCrudService<MovementStock>(PATH).post(`/endReserve/${movementStockId}`, {});
    }

}