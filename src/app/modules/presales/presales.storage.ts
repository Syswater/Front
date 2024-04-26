import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Distribution } from "src/data/models/distribution";

@Injectable({
    providedIn: 'root'
})
export class PresalesStorage {
    actualDistribution?: Distribution | null = null

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