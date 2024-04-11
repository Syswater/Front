import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Route, mapWeekdaysToBooleanArray, translateWeekdaysToSpanish } from '../models/route';

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    url = environment.API_URL;

    constructor(private http: HttpClient) { }

    async getRoutes(options?: { filter?: string, whit_status?: string }) {
        let params = new HttpParams();
        params = this.addParam('filter', options?.filter, params);
        params = this.addParam('whit_status', options?.whit_status, params);
        let routes = await firstValueFrom(this.http.get<Route[]>(`${this.url}/route/findAll`, { headers: this.getToken(), params }));
        return routes.map(route => { return translateWeekdaysToSpanish(route) });
    }

    private addParam(name: string, param: string | undefined, params: HttpParams) {
        if (param) {
            params = params.set(name, param);
        }
        return params;
    }

    getBooleaDays(days: string[]) {
        return mapWeekdaysToBooleanArray(days);
    }

    private getToken(): HttpHeaders {
        return new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem("token") });
    }
}