import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppStorage } from 'src/app/app.storage';
import { AuthService } from 'src/data/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent {

  constructor(private router: Router, private appStorage: AppStorage, private authService: AuthService) { }

  goToLogin() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.authService.isLoginView = true
      this.router.navigate(['/login'])
      return
    }
    const roleActual = localStorage.getItem('roleActual')
    if (!roleActual) {
      this.authService.isLoginView = true
      localStorage.removeItem('token')
      this.router.navigate(['/login'])
      return
    }
    this.appStorage.selectionMenu = 0
    switch (roleActual) {
      case 'Administrador':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'Prevendedor':
        this.router.navigate(['/preseller/dashboard']);
        break;
      case 'Distribuidor':
        this.router.navigate(['/distributor/dashboard']);
        break;
    }
  }

}
