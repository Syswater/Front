import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'https://jb02gq55-3000.use2.devtunnels.ms'

  constructor(private http: HttpClient) { }

  async login(credentials: any) {
    return await firstValueFrom(this.http.post(`${this.url}/auth/login`, { username: credentials.username, password: credentials.password }));
  }
  
}