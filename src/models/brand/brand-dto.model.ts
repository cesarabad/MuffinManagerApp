import { GenericVersionDto } from "../generic-version-model/generic-version-dto.model";

export interface BrandDto extends GenericVersionDto{
    name: string;
    logoBase64: string;
}