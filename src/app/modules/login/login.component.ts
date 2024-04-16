import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/es';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { AuthService } from 'src/data/services/auth.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  fecha_actual: string = moment().format('[Bienvenido,] DD [de] MMMM [de] YYYY')
  formLogin: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })

  constructor(private authService: AuthService, private router: Router, private spinnerService: SpinnerService, private jwtHelper: JwtHelperService) { }
  
  ngOnInit(): void {
    const token = localStorage.getItem('token')
    if( token && !this.jwtHelper.isTokenExpired(token) ) this.router.navigate(['/dashboard']);
  }

  async login() {
    try {
      this.spinnerService.showSpinner(true)
      const data = await this.authService.login(this.formLogin.value)
      localStorage.setItem("token", data.token)
      this.authService.isLoginView = false
      this.router.navigate(['/dashboard'])
      showPopUp('Inicio de sesión exitoso', 'success')
    } catch (error) {
      showPopUp('Usuario y/o contraseña incorrectos', 'error')
    }
    this.spinnerService.showSpinner(false)
  }
}