import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    async getRoutes() {
        const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem("token") });
        let routes = await firstValueFrom(this.http.get<Route[]>(`${this.url}/route/findAll`, { headers }));
        return routes.map(route => { return translateWeekdaysToSpanish(route) });
    }

    getBooleaDays(days: string[]) {
        return mapWeekdaysToBooleanArray(days);
    }



}