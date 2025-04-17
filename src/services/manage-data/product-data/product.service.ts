import { ProductDto } from "../../../models/product-data/product/product-dto.model"
import { genericCrudVersionService } from "../generic-crud-version.service"
const PATH = '/manage/product-data/product'
export const productService = {...genericCrudVersionService<ProductDto>(PATH)}