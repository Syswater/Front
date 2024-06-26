import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/data/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AppStorage } from 'src/app/app.storage';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit {
  roles: string[] = [];
  formRoles: FormGroup = this.fb.group({
    role:
      localStorage.getItem('roleActual') == 'Administrador'
        ? 'ADMIN'
        : localStorage.getItem('roleActual') == 'Prevendedor'
        ? 'PRE_SELLER'
        : localStorage.getItem('roleActual') == 'Distribuidor'
        ? 'DISTRIBUTOR'
        : '',
  });

  constructor(
    private dialogRef: MatDialogRef<RoleComponent>,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private appStorage: AppStorage,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit(): void {
    const tokenData = this.jwtHelper.decodeToken(
      `${localStorage.getItem('token')}`
    );
    this.roles = tokenData.user.roles.split(',').filter((r: string) => r);
  }

  enterSystem() {
    this.removeValuesLocalStorage();
    switch (this.formRoles.value.role) {
      case 'ADMIN':
        localStorage.setItem('roleActual', 'Administrador');
        this.appStorage.actualRol = 'Administrador';
        this.router.navigate(['admin/dashboard']);
        break;
      case 'PRE_SELLER':
        localStorage.setItem('roleActual', 'Prevendedor');
        this.appStorage.actualRol = 'Prevendedor';
        this.router.navigate(['preseller/dashboard']);
        break;
      case 'DISTRIBUTOR':
        localStorage.setItem('roleActual', 'Distribuidor');
        this.appStorage.actualRol = 'Distribuidor';
        this.router.navigate(['distributor/dashboard']);
        break;
    }
    showPopUp(
      this.authService.isLoginView
        ? 'Inicio de sesión exitoso'
        : 'Cambio de rol exitoso',
      'success'
    );
    this.authService.isLoginView = false;
    this.dialogRef.close();
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
  }
}
