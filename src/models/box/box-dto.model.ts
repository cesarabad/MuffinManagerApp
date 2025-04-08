import { GenericDto } from "../generic-version-model/generic-version-dto.model";

export interface BoxDto extends GenericDto {
    description: string;
    europeanBase?: number;
    americanBase?: number;
    defaultHeight?: number;
}