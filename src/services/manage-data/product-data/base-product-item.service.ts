import { BaseProductItemDto } from "../../../models/product-data/base-product-item/base-product-item-dto.model"
import { genericCrudService } from "../generic-crud.service"
const PATH = '/manage/product-data/base-product-item'
export const baseProductItemService = {...genericCrudService<BaseProductItemDto>(PATH)}