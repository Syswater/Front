import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ModalService } from 'src/data/services/modal.service';
import { Observation } from 'src/data/models/observation';
import { PresalesFormComponent } from './components/presales-form/presales-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { PresalesService } from 'src/data/services/presales.service';
import { RouteService } from 'src/data/services/route.service';
import { Route } from 'src/data/models/route';
import { SpinnerService } from 'src/data/services/spinner.service';
import { PresalesStorage } from './presales.storage';
import { ClientService } from 'src/data/services/client.service';
import { MatSelectChange } from '@angular/material/select';
import { Distribution } from 'src/data/models/distribution';
import { DistributionService } from 'src/data/services/distribution.service';
import { DeleteModalComponent } from '../clients/components/delete-modal/delete-modal.component';
import { ClientStorage } from '../clients/client.storage';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/data/services/order.service';
import * as moment from 'moment';
import { getCurrentDate } from 'src/app/utils/DateUtils';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { DeleteOrderComponent } from './components/delete-order/delete-order.component';
import { ClientsFormComponent } from '../clients/components/clients-form/clients-form.component';

export interface Client {
  order: number;
  client: string;
  phoneNumber: string;
  debt: number;
  borrowedPackaging: number;
  quantity: number;
  observations: Observation[];
}

@Component({
  selector: 'app-presales',
  templateUrl: './presales.component.html',
  styleUrls: ['./presales.component.css'],
})
export class PresalesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'Orden',
    'Cliente',
    'Telefono',
    'Deudas',
    'Envases Prestados',
    'Observaciones',
    'Cantidad',
    'Atendido',
    'Acciones',
  ];
  dataSource = new MatTableDataSource<any>([]);
  disableSelect = new FormControl(false);
  distributions: Distribution[] = [];
  $reload!: Subscription
  filter?: string = '';

  constructor(
    private clientService: ClientService,
    public preSaleStorage: PresalesStorage,
    private spinner: SpinnerService,
    private modalService: ModalService,
    private distributionService: DistributionService,
    private orderService: OrderService,
    private clientStorage: ClientStorage
  ) { }

  ngOnDestroy(): void {
    this.$reload.unsubscribe()
  }

  async ngOnInit() {
    await this.getDistributions();
    await this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route);
    this.$reload = this.preSaleStorage.getObservable('reloadClients').subscribe(() => {
      this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    })
  }

  async getClientsByRoute(route: Route | undefined | null) {
    this.spinner.showSpinner(true);
    this.dataSource.data = (await this.clientService.getListClients({
      route_id: route!.id,
      distribution_id: this.preSaleStorage.actualDistribution?.id,
      with_notes: true,
      with_order: true,
      filter: this.filter
    })).map(d => ({ ...d, editable: false, quantity: '-' }));
    this.spinner.showSpinner(false);
  }

  async getDistributions() {
    this.spinner.showSpinner(true);
    this.distributions = await this.distributionService.getDistributions({ status: 'PREORDER', with_route: true })
    this.preSaleStorage.actualDistribution = this.distributions[0]
    this.spinner.showSpinner(false);
  }

  showDialogClient(element: any, flag: number) {
    this.preSaleStorage.actualClient = element
    this.clientStorage.actualClient = element
    this.clientStorage.actualRoute = this.preSaleStorage.actualDistribution?.route
    switch (flag) {
      case 1:
        this.modalService.open(ClientsFormComponent, () => { });
        break;
      case 2:
        this.modalService.open(DeleteOrderComponent, () => { });
        break;
    }
  }

  decrementQuantity(element: any) {
    if ((element.quantity <= 0 || element.quantity == '-') && !element.order) {
      element.quantity = '-'
    } else {
      element.quantity--
      if (element.order && element.order.amount > 0) element.order.amount--
    }
  }
  incrementQuantity(element: any) {
    if (element.quantity == '-' && !element.order) element.quantity = -1
    element.quantity++
    if (element.order) element.order.amount++
  }

  changeRoute(event: any) {
    this.getClientsByRoute(this.distributions.find((r: Distribution) => r.route_id == event.value)?.route);
  }

  updateOrCreateOrder(element: any) {
    element.editable = !element.editable
    if (!element.order) {
      if (element.editable) this.createOrder(element)
    } else {
      if (!element.editable) this.updateOrder(element)
    }
  }

  async createOrder(element: any) {
    try {
      this.spinner.showSpinner(true);
      await this.orderService.createOrder({ amount: element.quantity == '-' ? 0 : element.quantity, customer_id: element.id, date: getCurrentDate(), distribution_id: this.preSaleStorage.actualDistribution!.id, tape_type: element.tape_preference });
      showPopUp('Orden creada con exito', 'success')
      this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    } catch (error) {
      showPopUp('Error al crear la orden', 'error')
    }
    this.spinner.showSpinner(false);
  }

  async updateOrder(element: any) {
    try {
      this.spinner.showSpinner(true);
      await this.orderService.updateOrder({ id: element.order.id, amount: element.order.amount, tape_type: element.tape_preference });
      showPopUp('Orden actualizada con exito', 'success');
      this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    } catch (error) {
      showPopUp('Error al actualizar la orden', 'error');
    }
    this.spinner.showSpinner(false);
  }

  getTotalProductsSelled() {
    let total = 0
    for (const client of this.dataSource.data) {
      total += client.order ? client.order.amount : client.quantity != '-' ? client.quantity : 0
    }
    return total
  }

  getTotalClientsAnswered() {
    let total = 0
    for (const client of this.dataSource.data) {
      total += client.order ? 1 : 0
    }
    return total
  }

  async filterClients(textOrEvent: string | KeyboardEvent) {
    if (textOrEvent instanceof KeyboardEvent) {
      const event = textOrEvent as KeyboardEvent;
      const keyPressed = event.key; // La tecla presionada.
      const inputText = (event.target as HTMLInputElement).value;
      if (keyPressed == 'Enter') {
        this.filter = inputText
        await this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
      }
    } else {
      console.log('entro')
      this.filter = `${textOrEvent}`
      await this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    }
  }

  async clearFilter(input: HTMLInputElement) {
    this.filter = undefined
    await this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    input.value = ''
  }
}
