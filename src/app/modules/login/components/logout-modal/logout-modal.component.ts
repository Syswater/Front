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
    localStorage.removeItem('token');
    localStorage.removeItem('roleActual');
    this.auth.isLoginView = true
    this.router.navigate(['/login']);
    showPopUp('Sesion cerrada con exito', 'success')
  }

}
