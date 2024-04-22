import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ClientStorage } from 'src/app/modules/clients/client.storage';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { ClientService } from 'src/data/services/client.service';
import { SpinnerService } from 'src/data/services/spinner.service';

@Component({
  selector: 'app-delete-note',
  templateUrl: './delete-note.component.html',
  styleUrls: ['./delete-note.component.css']
})
export class DeleteNoteComponent {

  constructor(public clientStorage: ClientStorage, private clientService: ClientService, private spinnerService: SpinnerService, private dialogRef: DialogRef<DeleteNoteComponent>) { }

  async deleteNote() {
    try {
      this.spinnerService.showSpinner(true)
      await this.clientService.deleteNote(this.clientStorage.deleteNote?.id)
      showPopUp('Observación eliminada con éxito', 'success')
      if(this.clientStorage.actualClient){
        const index = this.clientStorage.actualClient.note.findIndex(note => note.id == this.clientStorage.deleteNote?.id);
        this.clientStorage.actualClient?.note.splice(index, 1);
      }
      this.clientStorage.setObservableValue(true, 'reloadClients')
    } catch (error) {
      showPopUp('Error al eliminar la observación', 'error')
    }
    this.spinnerService.showSpinner(false)
    this.dialogRef.close()
  }

}
