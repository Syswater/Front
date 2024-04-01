import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/es';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { AuthService } from 'src/data/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  fecha_actual: string = moment().format('[Bienvenido,] DD [de] MMMM [de] YYYY')
  formLogin: FormGroup = new FormGroup({
    username: new FormControl('', Validators.email),
    password: new FormControl('', Validators.pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{1,8}$/))
  })

  constructor(private authService: AuthService, private router: Router) { }

  async login() {
    try {
      const data = await this.authService.login(this.formLogin.value)
      this.router.navigate(['/dashboard'])
      showPopUp('Inicio de sesión exitoso', 'success')
    } catch (error) {
      showPopUp('Usuario y/o contraseña incorrectos', 'error')
    }
  }
}