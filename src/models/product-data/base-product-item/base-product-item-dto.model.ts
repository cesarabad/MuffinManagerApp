import { GenericDto } from "../../generic-version-model/generic-version-dto.model";

export interface BaseProductItemDto extends GenericDto {
    mainDescription: string,
    muffinShape?: number,
    weight?: number,
    unitsPerItem?: number,
}