export interface ProductLightDto {
    reference: string;
    description: string;
    boxReference: string;
    boxDescription: string;
    itemsPerProduct: number;
    aliasVersion: string | null;
  }