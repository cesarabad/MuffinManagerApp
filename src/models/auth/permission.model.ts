export enum Permission {
    Dev = 'dev',
    SuperAdmin = 'super_admin',
    Employee = 'employee',
    ManageUsers = 'manage_users',
    ManageData = 'manage_data',
    ManageStock = 'manage_stock',
    GetData = 'get_data',
    GetStock = 'get_stock',
    CreateUsers = 'create_users'
  }

export interface PermissionEntity {
  id: number;
  name: string;
}

export interface GroupEntity {
  id: number;
  name: string;
  permissions: PermissionEntity[];
}

export interface AvailableUserPermissions {
  permissions: PermissionEntity[];
  groups: GroupEntity[];
}

export type PermissionList = Permission[];
export const GroupedPermissions: Record<
  string,
  PermissionList | Record<string, PermissionList>
> = {
  data: [
      Permission.GetData,
      Permission.ManageData,
  ],
  stock: [
    Permission.GetStock,
    Permission.ManageStock,
  ],
  users: [Permission.CreateUsers, Permission.ManageUsers],
  role: [Permission.Dev, Permission.SuperAdmin, Permission.Employee],
};
