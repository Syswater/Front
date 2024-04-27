import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RoleComponent } from './components/role/role.component';
import { SharedModule } from '../shared/shared.module';
import { LogoutModalComponent } from './components/logout-modal/logout-modal.component';

@NgModule({
  declarations: [
    LoginComponent,
    RoleComponent,
    LogoutModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class LoginModule { }
