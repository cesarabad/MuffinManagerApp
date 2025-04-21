import { UserSafeDto } from "../../auth/user-safe-dto.model";

export enum MovementType {
  Entry = 'Entry',
  Assigned = 'Assigned',
  Adjustment = 'Adjustment',
  Reserve = 'Reserve',
}

export enum MovementStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Canceled = 'Canceled',
}

export interface MovementStock {
  id: number;
  productStockId: number;
  productReference: string;
  batch: string;
  packagePrintDescription: string;
  type: MovementType;
  responsible: UserSafeDto;
  units: number;
  destination: string;
  creationDate: Date;
  endDate: string | null;
  observations: string | null;
  status: MovementStatus;
}

export interface ActiveReserveDto {
  id: number;
  responsible: string | null;
  units: number;
  destination: string;
  creationDate: Date;
  observations: string | null;
}