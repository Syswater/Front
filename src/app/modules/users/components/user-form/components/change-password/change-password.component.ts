import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UsersStorage } from 'src/app/modules/users/users.storage';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { SpinnerService } from 'src/data/services/spinner.service';
import { UserService } from 'src/data/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {

  formChangePassword: FormGroup = this.fb.group({
    username: this.userStorage.actualUser!.username,
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private spinner: SpinnerService,
    private userService: UserService,
    public userStorage: UsersStorage,
    private dialogRef: MatDialogRef<ChangePasswordComponent>
  ) { }

  close(){
    this.dialogRef.close()
  }

  async changePassword() {
    try {
      this.spinner.showSpinner(true)
      await this.userService.changePassword(this.formChangePassword.value);
      showPopUp('Contraseña actualizada con éxito', 'success');
      this.userStorage.setObservableValue(true, 'reloadUsers');
      this.dialogRef.close();
    } catch (error: any) {
      showPopUp(error.error.message == "WRONG_USER_PASSWORD" ? 'Contraseña incorrecta' : 'Error al actualizar la Contraseña', 'error')
    }
    this.spinner.showSpinner(false)
  }
}
