import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NavigationStart, Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  async getDistributionUsers(options: { distribution_id: number }) {
    const { distribution_id } = options
    const params = new HttpParams().set('distribution_id', distribution_id)
    return firstValueFrom(this.http.get<User[]>(`${this.url}/users/getDistributionUsers`, { params }));
  }

  async getAllUsers(options: { role?: string, filter?: string }) {
    const { role, filter } = options
    let params = new HttpParams()
    if (role) params = params.set('role', role)
    if (filter) params = params.set('filter', filter)
    return firstValueFrom(this.http.get<User[]>(`${this.url}/users/findAll`, { params }));
  }

  async deleteUser(options: { id: number }) {
    const { id } = options
    return firstValueFrom(this.http.delete(`${this.url}/users/delete`, { body: { id } }));
  }

  async changePassword(options: { username: string, oldPassword: string, newPassword: string }) {
    return firstValueFrom(this.http.put(`${this.url}/users/change-password`, { ...options }));
  }

  async createUser(options: any) {
    return firstValueFrom(this.http.post(`${this.url}/users/create`, { ...options }));
  }

  async updateUser(options: any) {
    return firstValueFrom(this.http.put(`${this.url}/users/update`, { ...options }));
  }
}