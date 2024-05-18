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

  constructor(private http: HttpClient) {}

  async getDistributionUsers(options: { distribution_id: number}) {
    const { distribution_id } = options
    const params = new HttpParams().set('distribution_id', distribution_id)
    return await firstValueFrom(this.http.get<User[]>(`${this.url}/users/getDistributionUsers`, { params }));
  }

  async getAllUsers(options: { role?: string}) {
    const { role } = options
    let params = new HttpParams()
    if(role) params = params.set('role', role)
    return await firstValueFrom(this.http.get<User[]>(`${this.url}/users/findAll`, { params }));
  }

}