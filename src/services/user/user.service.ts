import { UserDetailedDto } from "../../models/auth/user-detailed-dto.model";
import { UserSafeDto } from "../../models/auth/user-safe-dto.model";
import { AvailableUserPermissions, GroupEntity, UserStats } from "../../models/index.model";
import { httpCrudService } from "../http-crud.service";

const PATH = "/user";
export const userService = {

    getPath: () => PATH,

    getStats: (userId: number) => {
        return httpCrudService<UserStats>(PATH).get(`/stats/${userId}`);
    },

    getAllUsers: () => {
        return httpCrudService<UserSafeDto[]>(PATH).get("/all");
    },

    toggleDisabledUser: (userId: number) => {
        return httpCrudService<void>(PATH).post(`/toggleDisabled/${userId}`, {});
    },

    getDetailedUser: async (userId: number) => {
        return await httpCrudService<UserDetailedDto>(PATH).get(`/detailed/${userId}`);
    },

    getAvailableUserPermissions: async () => {
        return await httpCrudService<AvailableUserPermissions>(PATH).get("/availablePermissions");
    },

    saveGroupEntity: async (groupEntityDto: GroupEntity) => {
        return await httpCrudService<GroupEntity>(PATH).post("/saveGroup", groupEntityDto);
    },

    deleteGroupEntity: async (groupId: number) => {
        return await httpCrudService<void>(PATH).delete(`/deleteGroup/${groupId}`);
    }

}