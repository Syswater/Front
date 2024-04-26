import { Route } from "./route";

export interface Distribution {
    id: number;
    date: Date;
    load_up: number;
    broken_containers: number;
    status: string;
    route_id: number;
    product_inventory_id: number;
    route: Route;
}
