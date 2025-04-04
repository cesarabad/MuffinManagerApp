import { PermissionList } from "./index.model";

export interface User {
    id: number,
    dni: string,
    name: string,
    secondName: string,
    permissions: PermissionList,
    token: string
}