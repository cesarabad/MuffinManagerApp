import { PackagePrintLightDto } from "../../package-print/package-print-light-dto.model";
import { ProductLightDto } from "../../product-data/product/product-light-dto.model";
import { ActiveReserveDto } from "../movement-stock/reserve-dto.model";


export interface ProductStockRequestDto {
    id?: number;
    productId?: number;
    packagePrintId?: number;
    batch?: string;
    stock?: number;
    observations?: string | null;
    lastCheckDate?: Date;
}

export interface ProductStockResponseDto {
    id: number;
    packagePrint: PackagePrintLightDto;
    batch: string;
    stock: number;
    observations: string | null;
    lastCheckDate: Date;
    hasToCheck: boolean;
    reserves: ActiveReserveDto[];
}

  
export interface ProductContent {
    product: ProductLightDto;
    stockDetails: ProductStockResponseDto[];
  }
  
  export interface MuffinShapeContent {
    muffinShape: string;
    products: ProductContent[];
  }
  
  export interface BrandContent {
    brandName: string;
    brandAliasVersion: string | null;
    brandLogoBase64: string | null;
    muffinShapes: MuffinShapeContent[];
  }
  
  export type StockResponse = BrandContent[];

  