import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.API_URL
  isLoginView = window.location.pathname == '/login'

  constructor(private http: HttpClient) { }

  async login(credentials: any) {
    return await firstValueFrom(this.http.post<{ token: string }>(`${this.url}/auth/login`, { username: credentials.username, password: credentials.password }));
  }

}