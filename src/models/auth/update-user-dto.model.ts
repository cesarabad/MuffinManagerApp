import { GroupEntity, PermissionEntity } from "./permission.model";

export interface UpdateUserDto {
    id: number;
    dni: string;
    name: string;
    secondName: string;
    disabled: boolean;
    password: string;
    newPassword?: string;
    permissions: PermissionEntity[];
    groups: GroupEntity[];
}