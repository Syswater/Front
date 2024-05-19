import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { SpinnerService } from 'src/data/services/spinner.service';
import { UserService } from 'src/data/services/user.service';
import { UsersStorage } from '../../users.storage';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.css']
})
export class DeleteUserModalComponent {

  constructor(
    public userStorage: UsersStorage,
    private spinner: SpinnerService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DeleteUserModalComponent>
  ) { }

  async deleteUser() {
    try {
      this.spinner.showSpinner(true)
      await this.userService.deleteUser({
        id: this.userStorage.actualUser!.id
      })
      showPopUp('Usuario eliminado con éxito', 'success');
      this.userStorage.setObservableValue(true, 'reloadUsers');
    } catch (error) {
      showPopUp('Error al eliminar el usuario', 'error');
    }
    this.dialogRef.close()
    this.spinner.showSpinner(false)
  }
}
