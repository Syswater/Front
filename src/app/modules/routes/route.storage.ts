import { Injectable } from "@angular/core";
import { Route } from "src/data/models/route";

@Injectable({
    providedIn: 'root'
})
export class RouteStorage {
    actualRoute: Route | null = null
}