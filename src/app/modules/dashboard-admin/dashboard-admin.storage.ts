import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Route } from "src/data/models/route";

@Injectable({
    providedIn: 'root'
})
export class DashboardAdminStorage {
    actualRoute?: Route | null = null

    //OBSERVABLES
    private observables : any = {
        reloadClients: new BehaviorSubject<boolean>(false)
    }

    setObservableValue(value: boolean, key: string) {
        this.observables[key].next(value);
    }

    getObservable(key: string): Observable<any> {
        return this.observables[key].asObservable();
    }
}