import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppStorage {
  user: any = localStorage.getItem('token') ? this.jwtHelper.decodeToken(`${localStorage.getItem('token')}`).user : '';
  actualRol: string = `${localStorage.getItem('roleActual')}`;
  lateralMenuExpansion = false
  selectionMenu: number = 0;

  constructor(private jwtHelper: JwtHelperService) { }
  
  //OBSERVABLES
  private observables: any = {
    reloadLateralMenu: new BehaviorSubject<boolean>(false)
  }

  setObservableValue(value: boolean, key: string) {
    this.observables[key].next(value);
  }

  getObservable(key: string): Observable<any> {
    return this.observables[key].asObservable();
  }

}