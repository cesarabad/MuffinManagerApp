import { BrandDto } from "../../models/brand/brand-dto.model"
import { genericCrudVersionService } from "./generic-crud-version.service"
const PATH = '/manage/brand'
export const brandService = {...genericCrudVersionService<BrandDto>(PATH)}