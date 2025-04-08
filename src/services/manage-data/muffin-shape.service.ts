import { MuffinShapeDto } from "../../models/muffin-shape/muffin-shape-dto.model"
import { genericCrudService } from "./generic-crud.service"
const PATH = '/manage/muffin-shape'
export const muffinShapeService = {...genericCrudService<MuffinShapeDto>(PATH)}