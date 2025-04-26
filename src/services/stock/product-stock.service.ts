import { ProductStockRequestDto, ProductStockResponseDto, StockResponse } from "../../models/stock/product-stock/product-stock-dto.model";
import { httpCrudService } from "../http-crud.service";
const PATH = "/stock/product-stock"

export const productStockService = {

    getPath: () => PATH,
    
    getGroupedBy: async () => {
        return await httpCrudService<StockResponse>(PATH).get("/getGroupedBy");
    },

    getByProductId: async (productId: number) => {
        return await httpCrudService<ProductStockResponseDto>(PATH).get(`/getByProductId?productId=${productId}`);
    },

    insert: async (model: ProductStockRequestDto) => {
        return await httpCrudService<ProductStockResponseDto>(PATH).post<ProductStockRequestDto>("/insert", model);
    },

    updateLastCheckDate: async (productStockId: number) => {
        return await httpCrudService<void>(PATH).post(`/updateLastCheckDate/${productStockId}`, {});
    }
}