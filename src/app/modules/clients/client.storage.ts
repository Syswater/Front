import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Client } from "src/data/models/client";
import { Observation } from "src/data/models/observation";
import { Route } from "src/data/models/route";

@Injectable({
    providedIn: 'root'
})
export class ClientStorage {
    actualClient?: Client | null = null
    actualRoute?: Route | null = null
    lastClient?: Client | null = null
    deleteNote?: Observation | null = null

    //OBSERVABLES
    private observables : any = {
        reloadClients: new BehaviorSubject<boolean>(false),
        reloadTransactionPayment: new BehaviorSubject<boolean>(false),
        reloadTransactionContainers: new BehaviorSubject<boolean>(false)
    }

    setObservableValue(value: boolean, key: string) {
        this.observables[key].next(value);
    }

    getObservable(key: string): Observable<any> {
        return this.observables[key].asObservable();
    }
}