import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Client } from "src/data/models/client";
import { Distribution } from "src/data/models/distribution";
import { Expense } from "src/data/models/expense";

@Injectable({
    providedIn: 'root'
})
export class ExpensesStorage {
    actualDistribution?: Distribution | null = null
    actualClient?: Client | null = null
    actualExpense?: Expense | null = null
    isUpdateCreationExpense: boolean = false;

    //OBSERVABLES
    private observables : any = {
        reloadExpenses: new BehaviorSubject<boolean>(false)
    }

    setObservableValue(value: boolean, key: string) {
        this.observables[key].next(value);
    }

    getObservable(key: string): Observable<any> {
        return this.observables[key].asObservable();
    }
}