import { GenericVersionDto } from "../../generic-version-model/generic-version-dto.model";

export interface ProductItemDto extends GenericVersionDto {
    baseProductItemId?: number,
    brandId?: number,
    mainDescription?: number,
    ean13?: number,

}