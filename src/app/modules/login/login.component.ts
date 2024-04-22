import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/es';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { AuthService } from 'src/data/services/auth.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModalService } from 'src/data/services/modal.service';
import { RoleComponent } from './components/role/role.component';
import { LoginStore } from './login.store';


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

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private spinnerService: SpinnerService, 
    private jwtHelper: JwtHelperService,
    private modalService: ModalService,
    private loginStore: LoginStore
  ) {}
  
  ngOnInit(): void {
    const token = localStorage.getItem('token')
    if( token && !this.jwtHelper.isTokenExpired(token) ) this.router.navigate(['/dashboard']);
  }

  async login() {
    try {
      this.spinnerService.showSpinner(true)
      const data = await this.authService.login(this.formLogin.value)
      const tokenData = this.jwtHelper.decodeToken(data.token)
      const roles = tokenData.user.roles.split(',')
      localStorage.setItem("token", data.token)
      if(roles.length > 1){
        this.loginStore.roles = roles
        this.modalService.open(RoleComponent)
      }
    } catch (error) {
      showPopUp('Usuario y/o contraseña incorrectos', 'error')
    }
    this.spinnerService.showSpinner(false)
  }
}