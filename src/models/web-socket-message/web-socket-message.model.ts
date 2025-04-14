import { UserSafeDto } from "../auth/user-safe-dto.model";

export interface WebSocketMessage {
    dictionaryKey: string;
    user: UserSafeDto;
}