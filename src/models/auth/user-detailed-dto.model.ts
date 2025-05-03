import { GroupEntity, PermissionEntity } from "./permisos.model";

export interface UserDetailedDto {
    id: number;
    dni: string;
    name: string;
    secondName?: string;
    disabled: boolean;
    permissions: PermissionEntity[];
    groups: GroupEntity[];
}