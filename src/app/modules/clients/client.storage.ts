import { Injectable } from "@angular/core";
import { Client } from "src/data/models/client";
import { Route } from "src/data/models/route";

@Injectable({
    providedIn: 'root'
})
export class ClientStorage {
    actualClient?: Client | null = null
    actualRoute?: Route | null = null
}