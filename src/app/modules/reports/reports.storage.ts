import { Injectable } from "@angular/core";
import { Color, ScaleType } from "@swimlane/ngx-charts";
import { BehaviorSubject, Observable } from "rxjs";
import { Route } from "src/data/models/route";

@Injectable({
  providedIn: 'root'
})
export class ReportStorage {
  actualRoute: Route | null = null;
  colorScheme: Color = {
    selectable: true,
    name: 'SchemeSysWater',
    group: ScaleType.Ordinal,
    domain: ['#6EDBB6', '#6E96DB', '#FF99B7', '#6EB9DB', '#72DBDB','#6EDBDB', '#6EDB91', ]
  };

  constructor() {}
  
  //OBSERVABLES
  private observables: any = {
    reloadClients: new BehaviorSubject<boolean>(false)
  }

  setObservableValue(value: boolean, key: string) {
    this.observables[key].next(value);
  }

  getObservable(key: string): Observable<any> {
    return this.observables[key].asObservable();
  }

}