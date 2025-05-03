import { PermissionList } from "../index.model";

export interface User {
    id: number,
    dni: string,
    name: string,
    secondName?: string,
    permissions: PermissionList,
    token: string
}

export interface UserStats {
    user: number,
    name: string,
    totalEntries: number,
    totalAdjustments: number,
    totalAssigneds: number,
    totalReserveds: number,
    totalChecked: number,
}