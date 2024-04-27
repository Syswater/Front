import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
    providedIn: 'root'
})
export class AppStorage {
    username: string = localStorage.getItem('token') ? this.jwtHelper.decodeToken(`${localStorage.getItem('token')}`).user.name : '';
    actualRol: string = `${localStorage.getItem('roleActual')}`;

    constructor(private jwtHelper: JwtHelperService){}
}