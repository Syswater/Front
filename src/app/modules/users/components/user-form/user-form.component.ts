import { Component } from '@angular/core';
import { UsersStorage } from '../../users.storage';
import { SpinnerService } from 'src/data/services/spinner.service';
import { UserService } from 'src/data/services/user.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ModalService } from 'src/data/services/modal.service';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AppStorage } from 'src/app/app.storage';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('passwordR')?.value;

    return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
  };
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  roles = [
    {
      key: 'PRE_SELLER',
      value: 'Prevendedor',
    },
    {
      key: 'DISTRIBUTOR',
      value: 'Distribuidor',
    },
    {
      key: 'ADMIN',
      value: 'Administrador',
    },
  ];
  rolesControl: FormControl = new FormControl(
    this.userStorage.actualUser
      ? this.userStorage.actualUser.roles
        .split(',').filter((r: string) => r)
      : [], Validators.required
  );
  formUser: FormGroup = this.fb.group({
    name: [this.userStorage.actualUser?.name, [Validators.required, Validators.min(4)]],
    cellphone: [this.userStorage.actualUser?.cellphone, [Validators.required, Validators.min(10)]],
    username: [this.userStorage.actualUser?.username, Validators.required],
    password: ['', this.userStorage.actualUser ? [] : [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]],
    passwordR: ['', this.userStorage.actualUser ? [] : [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)]],
    roles: this.rolesControl,
  }, { validators: passwordMatchValidator() });

  constructor(
    public userStorage: UsersStorage,
    private spinner: SpinnerService,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private fb: FormBuilder,
    private modalService: ModalService,
    public appStorage: AppStorage
  ) { }

  close() {
    this.dialogRef.close();
  }

  async deleteUser() {
    try {
      this.spinner.showSpinner(true);
      await this.userService.deleteUser({
        id: this.userStorage.actualUser!.id,
      });
      this.userStorage.setObservableValue(true, 'reloadUsers');
      showPopUp('Usuario eliminado con éxito', 'success');
    } catch (error) {
      showPopUp('Error al eliminar el usuario', 'error');
    }
    this.spinner.showSpinner(false);
  }

  async updateUser() {
    try {
      this.spinner.showSpinner(true);
      const { username, password, passwordR, cellphone, ...user } = this.formUser.value
      await this.userService.updateUser({
        id: this.userStorage.actualUser!.id,
        ...user
      });
      showPopUp('Usuario actualizado con éxito', 'success')
      this.userStorage.setObservableValue(true, 'reloadUsers');
      setTimeout(() => {
        showPopUp('Recuerda actualizar tu sesión para ver los nuevos cambios', 'question');
      }, 5000)
      this.dialogRef.close()
    } catch (error) {
      showPopUp('Error al actualizar el usuario', 'error')
    }
    this.spinner.showSpinner(false)
  }

  async createUser() {
    try {
      this.spinner.showSpinner(true);
      const data = this.formUser.value
      await this.userService.createUser({
        ...data,
      });
      showPopUp('Usuario actualizado con éxito', 'success')
      this.userStorage.setObservableValue(true, 'reloadUsers');
      this.dialogRef.close()
    } catch (error) {
      showPopUp('Error al crear el usuario', 'error')
    }
    this.spinner.showSpinner(false)
  }

  hasRol(roleParam: string): boolean {
    return !!this.formUser.value.roles
      .find((role: string) => role == roleParam);
  }

  formatRole(role: string) {
    return this.roles.find(r => r.key == role)?.value
  }

  openChangePassword() {
    this.modalService.open(ChangePasswordComponent)
  }
}
