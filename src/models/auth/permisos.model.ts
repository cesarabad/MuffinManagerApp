export enum Permission {
    ManageUsers = 'manage_users',
    ManageData = 'manage_data',
    ManageStock = 'manage_stock',
    GetData = 'get_data',
    GetProductsData = 'get_products_data',
    GetProducts = 'get_products',
    GetProductItems = 'get_product_items',
    GetBaseProductItems = 'get_base_product_items',
    GetBrands = 'get_brands',
    GetBoxes = 'get_box',
    GetMuffinShapes = 'get_muffin_shapes',
    GetPackagePrints = 'get_package_print',
  }
export type PermissionList = Permission[];
