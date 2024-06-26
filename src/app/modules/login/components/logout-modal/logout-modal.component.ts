import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { AuthService } from 'src/data/services/auth.service';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrls: ['./logout-modal.component.css']
})
export class LogoutModalComponent {

  constructor(private auth: AuthService, private router: Router) { }

  logOut() {
    this.removeValuesLocalStorage()
    this.auth.isLoginView = true
    this.router.navigate(['/login']);
    showPopUp('Sesion cerrada con exito', 'success');
  }

  private removeValuesLocalStorage() {
    localStorage.removeItem('dashboard-admin-actualRoute');
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

}
