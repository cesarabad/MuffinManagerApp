import { GenericVersionDto } from "../../generic-version-model/generic-version-dto.model";

export interface ProductItemDto extends GenericVersionDto {
    baseProductItemId?: number,
    productItemInfo?: string,
    brandId?: number,
    ean13?: number,

}