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

  async deleteRoute() {
    try {
      this.spinnerService.showSpinner(true)
      if (this.routeStorage.actualRoute?.id) await this.routeService.delete(this.routeStorage.actualRoute?.id);
      showPopUp('Ruta eliminada exitosamente', 'success')
    } catch (e: any) {
      if ('NON_DELETABLE_ROUTE' === e.error.message) {
        showPopUp('No se puede eliminar una ruta que no esté cerrada', 'error')
      }
      else {
        showPopUp('Error al eliminar la ruta', 'error')
      }

    }
    this.spinnerService.showSpinner(false)
  }

}
