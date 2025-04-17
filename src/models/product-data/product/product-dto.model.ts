import { GenericVersionDto } from "../../generic-version-model/generic-version-dto.model";

export interface ProductDto extends GenericVersionDto{
    boxId?: number;
    boxInfo?: string;
    productItemId?: number;
    productItemInfo?: string;
    itemsPerProduct?: number;
    ean14?: string;
}