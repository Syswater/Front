import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { Sale } from '../models/sale';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  async createSale(saleObj: any) {
    return firstValueFrom(this.http.post(`${this.url}/sale/create`, { ...saleObj }));
  }

  async updateSale(sale: Sale) {
    return firstValueFrom(this.http.put(`${this.url}/sale/update`, { ...sale }));
  }
}
