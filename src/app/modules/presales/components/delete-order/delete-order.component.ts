import { Component } from '@angular/core';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { OrderService } from 'src/data/services/order.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { PresalesStorage } from '../../presales.storage';

@Component({
  selector: 'app-delete-order',
  templateUrl: './delete-order.component.html',
  styleUrls: ['./delete-order.component.css']
})
export class DeleteOrderComponent {

  constructor(private orderService: OrderService, private spinner: SpinnerService, private presalesStorage: PresalesStorage) { }

  async deleteOrder() {
    try {
      this.spinner.showSpinner(true)
      await this.orderService.deleteOrder({ id: this.presalesStorage.actualClient!.order!.id});
      showPopUp('Orden eliminada con éxito', 'success')
      this.presalesStorage.setObservableValue(true, 'reloadClients')
    } catch (error) {
      showPopUp('Error al eliminar la orden', 'error')
    }
    this.spinner.showSpinner(false)
  }

}
