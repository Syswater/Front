import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { ExpenseReport } from '../models/expense_report';
import { SaleReport } from '../models/sale_report';
import { ContainerReport } from '../models/container_report';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  async getSalesReport(options: { route_id: number, initDate: string, finalDate: string}) {
    const { route_id, initDate, finalDate } = options
    return firstValueFrom(this.http.get<SaleReport>(`${this.url}/reports/sales/${route_id}/${initDate}/${finalDate}`));
  }

  async getContainersReport(options: { route_id: number, initDate: string, finalDate: string}) {
    const { route_id, initDate, finalDate } = options
    return firstValueFrom(this.http.get<ContainerReport>(`${this.url}/reports/containers/${route_id}/${initDate}/${finalDate}`));
  }

  async getExpensesReport(options: { route_id: number, initDate: string, finalDate: string}) {
    const { route_id, initDate, finalDate } = options
    return firstValueFrom(this.http.get<ExpenseReport>(`${this.url}/reports/expenses/${route_id}/${initDate}/${finalDate}`));
  }


}
