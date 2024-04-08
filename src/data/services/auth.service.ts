import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.API_URL
  isLoginView = window.location.pathname == '/login' || window.location.pathname == '/'

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          this.isLoginView = window.location.pathname == '/login' || window.location.pathname == '/'
        }
      }
    });
  }

  async login(credentials: any) {
    return await firstValueFrom(this.http.post<{ token: string }>(`${this.url}/auth/login`, { username: credentials.username, password: credentials.password }));
  }

}