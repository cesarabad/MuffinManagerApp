import { GroupEntity, PermissionEntity } from "./permission.model";

export interface RegisterRequest {
    dni: string;
    name: string;
    secondName?: string;
    password: string;
    permissions: PermissionEntity[];
    groups: GroupEntity[];
}