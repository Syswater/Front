import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  url = environment.API_URL;

  constructor(private http: HttpClient) {}

  async getTransactionsPayments(options: {
    page: number;
    per_page: number;
    customer_id: number;
  }) {
    const { page, per_page, customer_id } = options;
    return firstValueFrom(
      this.http.get<Pagination>(
        `${this.url}/transactionPayment/findAll/${page}/${[
          per_page,
        ]}/${customer_id}`
      )
    );
  }

  async getTransactionsContainers(options: {
    page: number;
    per_page: number;
    customer_id: number;
  }) {
    const { page, per_page, customer_id } = options;
    return firstValueFrom(
      this.http.get<Pagination>(
        `${this.url}/transactionContainer/findAll/${page}/${[
          per_page,
        ]}/${customer_id}`
      )
    );
  }

  async createTransactionPayment(options: {
    date: string;
    type: string;
    customer_id: number;
    user_id: any;
    value: number;
    payment_method: string;
  }) {
    return firstValueFrom(
      this.http.post(`${this.url}/transactionPayment/create`, { ...options })
    );
  }

  async createTransactionContainer(options: {
    date: string;
    type: string;
    customer_id: number;
    user_id: any;
    product_inventory_id: number;
    value: number;
    distribution_id: number;
  }) {
    return firstValueFrom(
      this.http.post(`${this.url}/transactionContainer/create`, { ...options })
    );
  }
}
