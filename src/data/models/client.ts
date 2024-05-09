import { Observation } from "./observation";
import { Order } from "./order";
import { Sale } from "./sale";

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
    totalDebt: number;
    borrowedContainers: number;
    note: Observation[];
    order?: Order;
    sale?: Sale
  }