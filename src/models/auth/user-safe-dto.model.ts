export interface UserSafeDto {
    id: number;
    dni: string;
    name: string;
    secondName?: string;
    disabled: boolean;
}