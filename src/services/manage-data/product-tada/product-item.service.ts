import { ProductItemDto } from "../../../models/product-data/product-item/product-item-dto.model"
import { genericCrudVersionService } from "../generic-crud-version.service"
const PATH = '/manage/product-data/product-item'
export const productItemService = {...genericCrudVersionService<ProductItemDto>(PATH)}