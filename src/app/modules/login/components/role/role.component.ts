import { Component, OnInit } from '@angular/core';
import { LoginStore } from '../../login.store';
import { Router } from '@angular/router';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/data/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  roles: string[] = []
  formRoles: FormGroup = this.fb.group({
    role: ''
  })

  constructor(private dialogRef: MatDialogRef<RoleComponent>, private authService: AuthService, private loginStore: LoginStore, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.roles = this.loginStore.roles
  }

  enterSystem() {
    switch (this.formRoles.value.role) {
      case 'ADMIN':
        this.router.navigate(['admin/dashboard'])
        break;
      case 'PRE_SELLER':
        this.router.navigate(['preseller/dashboard'])
        break;
      case 'DISTRIBUTOR':
        this.router.navigate(['distributor/dashboard'])
        break;
    }
    this.authService.isLoginView = false
    showPopUp('Inicio de sesión exitoso', 'success')
    this.dialogRef.close()
  }

}
