import { httpCrudService } from "../http-crud.service"
import { MuffinShapePaths } from "./api-paths.constants";
export const genericCrudVersionService = <T>(path: string) => ({
    getNotObsoletes: async <T>() => {
        return await httpCrudService<T[]>(path).get(MuffinShapePaths.NOT_OBSOLETES);
    },

    getNotObsoletesDetailed: async () => {
        return await httpCrudService<T[]>(path).get(MuffinShapePaths.NOT_OBSOLETES_DETAILED);
    },

    getObsoletes: async () => {
        return await httpCrudService<T[]>(path).get(MuffinShapePaths.OBSOLETES);
    },

    getAllInactives: async () => {
        return await httpCrudService<T[]>(path).get(MuffinShapePaths.ALL_INACTIVES);
    },

    insertOrUpdate: async (muffinShape: T) => {
        return await httpCrudService<T>(path).post<T>(MuffinShapePaths.SAVE, muffinShape);
    },

    deleteByReference: async (reference: string) => {
        return await httpCrudService<T>(path).delete(`${MuffinShapePaths.DELETE_ALL}/${reference}`);
    },

    deleteByReferenceAndVersion: async (reference: string, version: number) => {
        return await httpCrudService<T>(path).delete(`${MuffinShapePaths.DELETE}/${reference}?version=${version}`);
    },

    setObsoleteByReference: async (reference: string, obsolete: boolean) => {
        return await httpCrudService<boolean>(path).patch(`${MuffinShapePaths.SET_OBSOLETE}/all/${reference}?obsolete=${obsolete}`);
    },

    setObsoleteByReferenceAndVersion: async (reference: string, version: number, obsolete: boolean) => {
        return await httpCrudService<boolean>(path).patch(`/${MuffinShapePaths.SET_OBSOLETE}/${reference}?version=${version}&obsolete=${obsolete}`);
    },

    setActiveByReference : async (reference: string, active: boolean) => {
        return await httpCrudService<boolean>(path).patch(`${MuffinShapePaths.SET_ACTIVE}/all/${reference}?isActive=${active}`);
    },

    setActiveByReferenceAndVersion : async (reference: string, version: number, active: boolean) => {
        return await httpCrudService<boolean>(path).patch(`${MuffinShapePaths.SET_ACTIVE}/${reference}?version=${version}&isActive=${active}`);
    },

    changeReference: async (reference: string, newReference: string) => {
        return await httpCrudService<T[]>(path).patch(`${MuffinShapePaths.CHANGE_REFERENCE}?oldReference=${reference}&newReference=${newReference}`);
    }
})