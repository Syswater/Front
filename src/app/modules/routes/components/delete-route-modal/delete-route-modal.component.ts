import { Component } from '@angular/core';
import { showPopUp } from '../../../../utils/SwalPopUp';
import { RouteService } from '../../../../../data/services/route.service';
import { SpinnerService } from '../../../../../data/services/spinner.service';
import { RouteStorage } from '../../route.storage';

@Component({
  selector: 'app-delete-route-modal',
  templateUrl: './delete-route-modal.component.html',
  styleUrls: ['./delete-route-modal.component.css']
})
export class DeleteRouteModalComponent {
  constructor(
    public routeStorage: RouteStorage,
    private spinnerService: SpinnerService,
    private routeService: RouteService
  ) { }

  async deleteClient() {
    try {
      this.spinnerService.showSpinner(true)
      if (this.routeStorage.actualRoute?.id) await this.routeService.delete(this.routeStorage.actualRoute?.id);
      showPopUp('Cliente eliminado exitosamente', 'success')
    } catch (error) {
      showPopUp('Error al eliminar el cliente', 'error')
    }
    this.spinnerService.showSpinner(false)
  }

}
