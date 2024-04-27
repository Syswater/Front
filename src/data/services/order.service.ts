import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  url = environment.API_URL;

  constructor(private http: HttpClient) { }

  async createOrder(options: { amount: number, date: string, tape_type: string, customer_id: number, distribution_id: number }) {
    return await firstValueFrom(this.http.post(`${this.url}/order/create`, { ...options  }));
  }
  
  async updateOrder(options: { id: number, amount: any; tape_type: any; }) {
    return await firstValueFrom(this.http.put(`${this.url}/order/update`, { ...options  }));
  }
  
  async deleteOrder(options: { id: number; }) {
    const { id } = options
    return await firstValueFrom(this.http.delete(`${this.url}/order/delete`, { body: { id }  }));
  }
}
