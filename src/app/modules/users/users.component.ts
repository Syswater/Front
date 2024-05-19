import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStorage } from 'src/app/app.storage';
import { UsersStorage } from './users.storage';
import { User } from 'src/data/models/user';
import { UserService } from 'src/data/services/user.service';
import { ModalService } from 'src/data/services/modal.service';
import { UserFormComponent } from './components/user-form/user-form.component';
import { DeleteUserModalComponent } from './components/delete-user-modal/delete-user-modal.component';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { SpinnerService } from 'src/data/services/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'Usuario',
    'Alias (Nombre de usuario)',
    'Telefono',
    'Roles',
    'Acciones',
  ];
  dataSource: User[] = [];
  filter?: string;
  $reloadUsers!: Subscription

  constructor(
    public appStorage: AppStorage,
    public usersStorage: UsersStorage,
    private userService: UserService,
    private modalService: ModalService,
    private spinnser: SpinnerService
  ) { }

  ngOnInit() {
    this.$reloadUsers = this.usersStorage.getObservable('reloadUsers').subscribe(() => this.getUsers())
  }

  async getUsers() {
    try {
      this.spinnser.showSpinner(true)
      this.dataSource = await this.userService.getAllUsers({
        filter: this.filter
      })
    } catch (error) {
      showPopUp('Error al cargar los usuarios', 'error')
    }
    this.spinnser.showSpinner(false)
  }

  ngOnDestroy(): void { }

  showDialogClient(index: number, user?: User) {
    this.usersStorage.actualUser = user
    switch (index) {
      case 1:
        this.modalService.open(UserFormComponent)
        break;
      case 2:
        this.modalService.open(DeleteUserModalComponent)
        break;
    }
  }

  hasRol(user: User, roleParam: string): boolean {
    return !!user.roles.split(',').find(role => role == roleParam)
  }

  async filterClients(textOrEvent: string | KeyboardEvent) {
    if (textOrEvent instanceof KeyboardEvent) {
      const event = textOrEvent as KeyboardEvent;
      const keyPressed = event.key; // La tecla presionada.
      const inputText = (event.target as HTMLInputElement).value;
      if (keyPressed == 'Enter') {
        this.filter = inputText
        await this.getUsers()
      }
    } else {
      this.filter = `${textOrEvent}`
      await this.getUsers()
    }
  }

  async clearFilter(input: HTMLInputElement) {
    this.filter = undefined
    await this.getUsers()
    input.value = ''
  }
}
