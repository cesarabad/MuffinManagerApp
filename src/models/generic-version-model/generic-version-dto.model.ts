import { UserSafeDto } from "../auth/user-safe-dto.model";

export interface GenericVersionDetailedDto {
    id?: number;
    reference: string;
    version: number;
    startDate?: Date;
    endDate?: Date;
    obsolete?: boolean;
    active?: boolean;
    lastModifyUser?: UserSafeDto;
}

export interface GenericDto {
    id?: number;
    reference: string;
    lastModifyDate?: Date;
    lastModifyUser?: UserSafeDto;
}
