import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "src/data/models/user";

@Injectable({
    providedIn: 'root'
})
export class UsersStorage {

    actualUser?: User

    //OBSERVABLES
    private observables : any = {
        reloadUsers: new BehaviorSubject<boolean>(false),
    }

    setObservableValue(value: boolean, key: string) {
        this.observables[key].next(value);
    }

    getObservable(key: string): Observable<any> {
        return this.observables[key].asObservable();
    }
}