import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { ExpenseCategory } from '../models/expense-category';
import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  url = environment.API_URL

  constructor(private http: HttpClient) { }

  async getExpensesCategories() {
    return firstValueFrom(this.http.get<ExpenseCategory[]>(`${this.url}/expense_category/findAll`));
  }

  async getListExpenses(options: { distribution_id: number; expense_category_id?: number }) {
    const { distribution_id, expense_category_id } = options
    let params = new HttpParams().set('distribution_id', distribution_id)
    if (expense_category_id) params = params.set('expense_category_id', expense_category_id)
    return firstValueFrom(this.http.get<Expense[]>(`${this.url}/expense/findAll`, { params }));
  }

  async createCategory(expenseData: { value: number, date: string, description: string, distribution_id: number, expense_category_id: number }) {
    return firstValueFrom(this.http.post(`${this.url}/expense/create`, { ...expenseData }));
  }
  
  async updateCategory(expense: any) {
    return firstValueFrom(this.http.put(`${this.url}/expense/update`, { ...expense }));
  }
  
  async deleteExpense(id: number) {
    return firstValueFrom(this.http.delete(`${this.url}/expense/delete`, { body: { id } }));
  }
}
