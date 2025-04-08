import { httpCrudService } from "../http-crud.service"

export interface genericCrudServiceInterface<T> {
    getAll: () => Promise<T[]>;
    getById: (id: number) => Promise<T>;
    insert: (model: T) => Promise<T>;
    update: (model: T) => Promise<T>;
    deleteById: (id: number) => Promise<void>;
}

export const genericCrudService = <T>(path: string): genericCrudServiceInterface<T> => ({
    getAll: async <T>() => {
        return await httpCrudService<T[]>(path).get("/getAll");
    },

    getById: async (id: number) => {
        return await httpCrudService<T>(path).get(`/getById/${id}`);
    },

    
    insert: async (model: T) => {
        return await httpCrudService<T>(path).post<T>("/insert", model);
    },

    update: async (model: T) => {
        return await httpCrudService<T>(path).post<T>(`/update`, model);
    },

    deleteById: async (id: number) => {
        return await httpCrudService<T>(path).delete(`/deleteById/${id}`);
    },

})