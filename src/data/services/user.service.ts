import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.API_URL

  constructor(private http: HttpClient) {}

  async getDistributionUsers(options: { distribution_id: number}) {
    const { distribution_id } = options
    const params = new HttpParams().set('distribution_id', distribution_id)
    return await firstValueFrom(this.http.get(`${this.url}/users/getDistributionUsers`, { params }));
  }

}