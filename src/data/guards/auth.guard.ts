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
      this.removeValuesLocalStorage()
      this.authService.isLoginView = true;
      showPopUp('No esta autorizado', 'error');
      return false;
    }
    if (!role) {
      this.removeValuesLocalStorage()
      this.router.navigate(['/login']);
      this.authService.isLoginView = true;
      showPopUp('No esta autorizado', 'error');
      return false;
    }
    return this.setRoutesConfigurations(state.url, role);
  }

  private removeValuesLocalStorage() {
    localStorage.removeItem('dashboard-pre-actualDistribution');
    localStorage.removeItem('dashboard-pre-actualRoute');
    localStorage.removeItem('dashboard-dist-actualRoute');
    localStorage.removeItem('dashboard-dist-actualDistribution');
    localStorage.removeItem('expenses-actualDistribution');
    localStorage.removeItem('sales-actualDistribution');
    localStorage.removeItem('sales-actualRoute');
    localStorage.removeItem('client-actualRoute');
    localStorage.removeItem('lastUserTransaction');
    localStorage.removeItem('token');
    localStorage.removeItem('roleActual');
  }

  setRoutesConfigurations(url: string, role: string) {
    const urlModuleRole = url.split('/')[1];

    if (
      (urlModuleRole == 'admin' && role != 'Administrador') ||
      (urlModuleRole == 'distributor' && role != 'Distribuidor') ||
      (urlModuleRole == 'preseller' && role != 'Prevendedor')
    ) {
      showPopUp('No esta autorizado', 'error');
      if (role == 'Administrador') this.router.navigate(['/admin/dashboard'])
      if (role == 'Distribuidor') this.router.navigate(['/distributor/dashboard'])
      if (role == 'Prevendedor') this.router.navigate(['/preseller/dashboard'])
      return false;
    }

    this.appStorage.setObservableValue(true, 'reloadLateralMenu');
    switch (url) {
      case '/preseller/dashboard':
      case '/admin/dashboard':
      case '/distributor/dashboard':
        this.appStorage.selectionMenu = 0;
        this.appStorage.moduleActual = 'Dashboard';
        break;
      case '/preseller/routes':
      case '/admin/routes':
      case '/distributor/routes':
        this.appStorage.selectionMenu = 1;
        this.appStorage.moduleActual = 'Rutas';
        break;
      case '/admin/clients':
        this.appStorage.selectionMenu = 2;
        this.appStorage.moduleActual = 'Clientes';
        break;
      case '/preseller/presales':
        this.appStorage.selectionMenu = 2;
        this.appStorage.moduleActual = 'Preventas';
        break;
      case '/distributor/distribution':
        this.appStorage.selectionMenu = 2;
        this.appStorage.moduleActual = 'Distribución';
        break;
      case '/preseller/clients':
      case '/distributor/clients':
        this.appStorage.selectionMenu = 3;
        this.appStorage.moduleActual = 'Clientes';
        break;
      case '/admin/reports':
        this.appStorage.selectionMenu = 3;
        this.appStorage.moduleActual = 'Reportes';
        break;
      case '/distributor/expenses':
        this.appStorage.selectionMenu = 4;
        this.appStorage.moduleActual = 'Gastos';
        break;
    }
    return true;
  }
}
