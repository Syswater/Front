import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Route, translateWeekdaysToSpanish } from '../models/route';

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    url = environment.API_URL;

    constructor(private http: HttpClient) { }

    async getRoutes(options?: { filter?: string, whit_status?: string, status?: string }) {
        let params = new HttpParams();
        params = this.addParam('filter', options?.filter, params);
        params = this.addParam('whit_status', options?.whit_status, params);
        params = this.addParam('status', options?.status, params);
        let routes = await firstValueFrom(this.http.get<Route[]>(`${this.url}/route/findAll`, { headers: this.getToken(), params }));
        return routes.map(route => { return translateWeekdaysToSpanish(route) });
    }

    async addRoute(name: string, location: string, price: number, weekdays: string[]) {
        const route = { name, location, price, weekdays }
        let newRoute = await firstValueFrom(this.http.post<Route>(`${this.url}/route/create`, route));
        return translateWeekdaysToSpanish(newRoute);
    }

    async updateRoute(id: number, name: string, location: string, price: number, weekdays: string[]) {
        const route = { id, name, location, price, weekdays }
        let newRoute = await firstValueFrom(this.http.put<Route>(`${this.url}/route/update`, route));
        return translateWeekdaysToSpanish(newRoute);
    }

    async delete(id: number) {
        return firstValueFrom(this.http.delete<Route>(`${this.url}/route/delete`, { body: { id } }));
    }

    private addParam(name: string, param: string | undefined, params: HttpParams) {
        if (param) {
            params = params.set(name, param);
        }
        return params;
    }

    private getToken(): HttpHeaders {
        return new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem("token") });
    }
}