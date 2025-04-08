import { BoxDto } from "../../models/box/box-dto.model"
import { genericCrudService } from "./generic-crud.service"
const PATH = '/manage/box'
export const boxService = {...genericCrudService<BoxDto>(PATH)}