import { Observation } from "./observation";

export interface Client {
    id: number;
    address: string;
    neighborhood: string | null;
    route_order: number;
    tape_preference: 'NORMAL' | 'SERVIFACIL'
    is_contactable: boolean;
    name: string | null;
    cellphone: string | null;
    route_id: number;
    note: Observation[];
  }