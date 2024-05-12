import { HttpClient, HttpParams } from '@angular/common/http';
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

  async getAllSalesCustomer(customer_id: number) {
    const params = new HttpParams().set('customer_id', customer_id)
    return firstValueFrom(this.http.get<Sale[]>(`${this.url}/sale/findAll`, { params }));
  }

  async updateSale(sale: any) {
    return firstValueFrom(this.http.put(`${this.url}/sale/update`, { ...sale }));
  }
}
