import { UserStats } from "../../models/index.model";
import { httpCrudService } from "../http-crud.service";
const PATH = "/user"

export const userService = {
    
    getPath: () => PATH,

    getStats: (userId: number) => {
        return httpCrudService<UserStats>(PATH).get(`/stats/${userId}`);
    }

}