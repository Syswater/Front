import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppStorage {
  user: any
  actualRol: string = `${localStorage.getItem('roleActual')}`;
  lateralMenuExpansion = false
  selectionMenu: number = 0;
  moduleActual: string = 'Dashboard';
  isDesktop: boolean = false;
  fromDistributionReport: boolean = false;

  constructor(private jwtHelper: JwtHelperService) {
    const userData = localStorage.getItem('token') ? this.jwtHelper.decodeToken(`${localStorage.getItem('token')}`).user : null;
    this.user = userData ? { ...userData, roles: userData.roles.split(',').filter((r: string) => r) } : ''
  }
  
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