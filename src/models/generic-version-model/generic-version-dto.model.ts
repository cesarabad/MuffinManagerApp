import { UserSafeDto } from "../auth/user-safe-dto.model";

export interface GenericVersionDto extends GenericDto{
    version?: number;
    aliasVersion?: string;
    creationDate?: Date;
    endDate?: Date;
    obsolete?: boolean;
}

export interface GenericDto {
    id?: number;
    reference?: string;
    lastModifyDate?: Date;
    lastModifyUser?: UserSafeDto;
}
