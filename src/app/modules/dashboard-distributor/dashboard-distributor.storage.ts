import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Distribution } from "src/data/models/distribution";
import { Route } from "src/data/models/route";

@Injectable({
    providedIn: 'root'
})
export class DashboardDistributorStorage {
    actualRoute?: Route | null = null
    actualDistribution: Distribution | null = null;

    //OBSERVABLES
    private observables : any = {
        reloadClients: new BehaviorSubject<boolean>(false)
    }

    setObservableValue(value: boolean, key: string) {
        this.observables[key].next(value);
    }

    getObservable(key: string): Observable<any> {
        new Promise((resolve, reject)=>{
            resolve('')
        })
        return this.observables[key].asObservable();
    }
}