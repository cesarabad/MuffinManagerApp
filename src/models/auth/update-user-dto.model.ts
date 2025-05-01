export interface UpdateUserDto {
    id: number;
    dni: string;
    name: string;
    secondName: string;
    password: string;
    newPassword?: string;
}