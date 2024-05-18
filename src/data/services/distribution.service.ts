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

  async getDistributions(options: { with_route?: boolean, status?: string, distributor_id?: number }) {
    const { with_route, status, distributor_id } = options
    let params = new HttpParams()
      .set('with_route', with_route ?? '')
      .set('status', status ?? '')
    if (distributor_id) params = params.set('distributor_id', distributor_id);
    return await firstValueFrom(this.http.get<Distribution[]>(`${this.url}/distribution/findAll`, { params }));
  }

  async createDistribution(options: { date: string; route_id: number; }) {
    return await firstValueFrom(this.http.post(`${this.url}/distribution/initDistribution`, { ...options }));
  }

  async openDistribution(options: { distribution_id: number; load: number; product_inventory_id: number, distributors_ids: number[] }) {
    return await firstValueFrom(this.http.post(`${this.url}/distribution/open`, { ...options }));
  }
  
  async changeStatusDistribution(options: { id?: number; status: string; }) {
    return await firstValueFrom(this.http.put(`${this.url}/distribution/changeStatus`, { ...options }));
  }

  async closeDistribution(options: { distribution_id?: number }) {
    return await firstValueFrom(this.http.post(`${this.url}/distribution/close`, { ...options }));
  }
}
