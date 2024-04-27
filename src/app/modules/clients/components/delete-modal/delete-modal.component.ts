import { Component } from '@angular/core';
import { ClientStorage } from '../../client.storage';
import { MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from 'src/data/services/spinner.service';
import { ClientService } from 'src/data/services/client.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {

  constructor(
    public clientStorage: ClientStorage,
    private spinnerService: SpinnerService,
    private clientService: ClientService
  ) {}

  async deleteClient(){
    try {
      this.spinnerService.showSpinner(true)
      await this.clientService.deleteClient(this.clientStorage.actualClient?.id);
      showPopUp('Cliente eliminado exitosamente', 'success')
      this.clientStorage.setObservableValue(true, 'reloadClients')
    } catch (error) {
      showPopUp('Error al eliminar el cliente', 'error')
    }
    this.spinnerService.showSpinner(false)
  }

}
