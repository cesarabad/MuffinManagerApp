import { PackagePrintDto } from "../../models/package-print/package-print-dto.model"
import { genericCrudService } from "./generic-crud.service"
const PATH = '/manage/package-print'
export const packagePrintService = {...genericCrudService<PackagePrintDto>(PATH)}