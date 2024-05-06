import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../services/auth.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { AppStorage } from 'src/app/app.storage';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private authService: AuthService,
    private appStorage: AppStorage
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('roleActual');
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      this.router.navigate(['/login']);
      this.authService.isLoginView = true;
      showPopUp('No esta autorizado', 'error');
      return false;
    }
    if (!role) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      this.authService.isLoginView = true;
      showPopUp('No esta autorizado', 'error');
      return false;
    }
    this.formatMenuSelection(state.url)
    return true;
  }

  formatMenuSelection(url: string) {
    console.log("🚀 ~ AuthGuard ~ formatMenuSelection ~ url:", url)
    switch (url) {
      case '/preseller/dashboard':
        this.appStorage.selectionMenu = 0
        break;
      case '/preseller/routes':
        this.appStorage.selectionMenu = 1
        break;
      case '/preseller/presales':
        this.appStorage.selectionMenu = 2
        break;
      case '/preseller/clients':
        this.appStorage.selectionMenu = 3
        break;
    }
  }

}
