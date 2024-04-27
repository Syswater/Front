import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { Distribution } from '../models/distribution';

@Injectable({
  providedIn: 'root'
})
export class DistributionService {
  

  url = environment.API_URL;

    constructor(private http: HttpClient) { }

    async getDistributions(options: { with_route?: boolean, status?: string }) {
      const { with_route, status } = options
      const params = new HttpParams()
      .set('with_route', with_route ?? '')
      .set('status', status ?? '')
      return await firstValueFrom(this.http.get<Distribution[]>(`${this.url}/distribution/findAll`, { params }));
    }
    
    async createDistribution(options: { date: string; route_id: number; }) {
      return await firstValueFrom(this.http.post(`${this.url}/distribution/initDistribution`, { ...options }));
    }

}
