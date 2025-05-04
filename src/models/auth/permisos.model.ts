export enum Permission {
    Dev = 'dev',
    SuperAdmin = 'super_admin',
    ManageUsers = 'manage_users',
    ManageData = 'manage_data',
    ManageStock = 'manage_stock',
    ManageMovementStock = 'manage_movement_stock',
    GetData = 'get_data',
    GetStock = 'get_stock',
    GetProductsData = 'get_products_data',
    GetProducts = 'get_products',
    GetProductItems = 'get_product_items',
    GetBaseProductItems = 'get_base_product_items',
    GetBrands = 'get_brands',
    GetBoxes = 'get_box',
    GetMuffinShapes = 'get_muffin_shapes',
    GetPackagePrints = 'get_package_print',
    CreateUsers = 'create_users',
    DisableUsers = 'disable_users'
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
  data: {
    general: [
      Permission.GetData,
      Permission.ManageData,
      Permission.GetBrands,
      Permission.GetBoxes,
      Permission.GetMuffinShapes,
      Permission.GetPackagePrints,
    ],
    products: [
      Permission.GetProductsData,
      Permission.GetProducts,
      Permission.GetProductItems,
      Permission.GetBaseProductItems,
    ],
  },
  stock: [
    Permission.GetStock,
    Permission.ManageStock,
    Permission.ManageMovementStock,
  ],
  users: [Permission.CreateUsers, Permission.DisableUsers, Permission.ManageUsers],
  admin: [Permission.Dev, Permission.SuperAdmin],
};
