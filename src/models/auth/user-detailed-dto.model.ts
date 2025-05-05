import { GroupEntity, PermissionEntity } from "./permission.model";

export interface UserDetailedDto {
    id: number;
    dni: string;
    name: string;
    secondName?: string;
    disabled: boolean;
    permissions: PermissionEntity[];
    groups: GroupEntity[];
}