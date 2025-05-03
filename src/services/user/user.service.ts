import { UserSafeDto } from "../../models/auth/user-safe-dto.model";
import { UserStats } from "../../models/index.model";
import { httpCrudService } from "../http-crud.service";
const PATH = "/user"

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
    }

}