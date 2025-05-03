import { GroupEntity, PermissionEntity } from "./permisos.model";

export interface UserDetailedDto {
    id: number;
    dni: string;
    name: string;
    secondName?: string;
    isDisabled: boolean;
    permissions: PermissionEntity[];
    groups: GroupEntity[];
}