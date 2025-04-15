import { httpCrudService } from "../http-crud.service"
import { genericCrudService, genericCrudServiceInterface } from "./generic-crud.service";

export interface genericCrudVersionServiceInterface<T> extends genericCrudServiceInterface<T> {
    getObsoletes: () => Promise<T[]>;
    deleteByReference: (reference: string) => Promise<void>;
    setObsoleteByReference: (reference: string, isObsolete: boolean) => Promise<void>;
    setObsoleteById: (id: number, isObsolete: boolean) => Promise<void>;
    changeReference: (oldReference: string, newReference: string) => Promise<void>;
}

export const genericCrudVersionService = <T>(path: string): genericCrudVersionServiceInterface<T> => ({
    ...genericCrudService<T>(path),

    getObsoletes: async () => {
        return await httpCrudService<T[]>(path).get("/getObsoletes");
    },

    deleteByReference: async (reference: string) => {
        return await httpCrudService<T>(path).delete(`/delete/${reference}`);
    },

    setObsoleteByReference: async (reference: string, isObsolete: boolean) => {
        return await httpCrudService<void>(path).post(`/setObsolete/${reference}?obsolete=${isObsolete}`, {});
    },

    setObsoleteById: async (id: number, isObsolete: boolean) => {
        return await httpCrudService<void>(path).post(`/setObsoleteById/${id}?obsolete=${isObsolete}`, {});
    },

    changeReference: async (oldReference: string, newReference: string) => {
        return await httpCrudService<void>(path).post(`/changeReference?oldReference=${oldReference}&newReference=${newReference}`, {  });
    }
})