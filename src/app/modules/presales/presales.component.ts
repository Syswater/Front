import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalService } from 'src/data/services/modal.service';
import { Observation } from 'src/data/models/observation';
import { MatTableDataSource } from '@angular/material/table';
import { Route } from 'src/data/models/route';
import { SpinnerService } from 'src/data/services/spinner.service';
import { PresalesStorage } from './presales.storage';
import { ClientService } from 'src/data/services/client.service';
import { Distribution } from 'src/data/models/distribution';
import { DistributionService } from 'src/data/services/distribution.service';
import { ClientStorage } from '../clients/client.storage';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/data/services/order.service';
import { getCurrentDate } from 'src/app/utils/DateUtils';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { DeleteOrderComponent } from './components/delete-order/delete-order.component';
import { ClientsFormComponent } from '../clients/components/clients-form/clients-form.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { QuantyInputModalComponent } from './components/quanty-input-modal/quanty-input-modal.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ExpensesStorage } from '../expenses/expenses.storage';
import { ValuePaidModalComponent } from './components/value-paid-modal/value-paid-modal.component';
import { SalesService } from 'src/data/services/sales.service';
import { AppStorage } from 'src/app/app.storage';
import { CloseRequestDistributionComponent } from './components/close-request-distribution/close-request-distribution.component';

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
  displayedColumnsDistribution: string[] = [
    'Orden',
    'Cliente',
    'deuda/envases',
    'Dirección',
    'Observaciones',
    'Cantidad',
    'Total a pagar',
    'Total pagado',
    'Entregado',
    'Acciones',
  ];
  dataSource = new MatTableDataSource<any>([]);
  disableSelect = new FormControl(false);
  distributions: Distribution[] = [];
  $reload!: Subscription
  filter?: string = '';
  role: string = '';

  constructor(
    private clientService: ClientService,
    public preSaleStorage: PresalesStorage,
    private spinner: SpinnerService,
    private modalService: ModalService,
    private distributionService: DistributionService,
    private orderService: OrderService,
    private clientStorage: ClientStorage,
    private jwtHelper: JwtHelperService,
    private expenseStorage: ExpensesStorage,
    private saleService: SalesService,
    private appStorage: AppStorage
  ) { }

  ngOnDestroy(): void {
    this.$reload.unsubscribe()
  }

  async ngOnInit() {
    this.role = `${localStorage.getItem('roleActual')}`
    await this.getDistributions();
    if(!localStorage.getItem('sales-actualRoute')) localStorage.setItem('sales-actualRoute', JSON.stringify(this.preSaleStorage.actualDistribution?.route))
    this.$reload = this.preSaleStorage.getObservable('reloadClients').subscribe(() => {
      this.getClientsByRoute(JSON.parse(`${localStorage.getItem('sales-actualRoute')}`))
    })
  }

  async getClientsByRoute(route: Route | undefined | null) {
    this.spinner.showSpinner(true);
    if (!route) {
      this.dataSource.data = []
    } else {
      this.dataSource.data = (await this.clientService.getListClients({
        route_id: route!.id,
        distribution_id: this.preSaleStorage.actualDistribution?.id,
        with_notes: true,
        with_order: true,
        filter: this.filter,
        with_sale: this.role == 'Distribuidor' ? true : undefined
      })).map(d => ({ ...d, editable: false, quantity: '-', unit_value: this.preSaleStorage.actualDistribution?.route.price, value_paid: d.sale ? d.sale.value_paid : 0, payment_method: 'EFECTIVO' }));
    }
    this.spinner.showSpinner(false);
  }

  async getDistributions() {
    this.spinner.showSpinner(true);
    this.distributions = await this.distributionService.getDistributions({
      status: this.role == 'Distribuidor' ? 'OPENED' : 'PREORDER', with_route: true, distributor_id: this.role == 'Distribuidor' ? this.jwtHelper.decodeToken(`${localStorage.getItem('token')}`).user.id : undefined
    })
    if(!localStorage.getItem('sales-actualDistribution')){
      localStorage.setItem('sales-actualDistribution', JSON.stringify(this.distributions[0]))
      this.preSaleStorage.actualDistribution = this.distributions.length > 0 ? this.distributions[0] : null
    }else{
      this.preSaleStorage.actualDistribution = JSON.parse(`${localStorage.getItem('sales-actualDistribution')}`) as Distribution
    }
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
    const distribution = this.distributions.find((r: Distribution) => r.route_id == event.value)
    localStorage.setItem('sales-actualDistribution', JSON.stringify(distribution))
    localStorage.setItem('sales-actualRoute', JSON.stringify(distribution?.route))
    this.getClientsByRoute(distribution?.route);
  }

  updateOrCreateOrder(element: any, checkBoxSelection: boolean) {
    element.editable = !element.editable
    if (!element.order) {
      if (checkBoxSelection) this.createOrder(element)
    } else {
      if (checkBoxSelection) this.updateOrder(element)
    }
  }

  updateOrCreateSale(element: any, checkBoxSelection: boolean) {
    element.editable = !element.editable
    if (!checkBoxSelection) element.is_served = false
    if (!element.sale) {
      if (checkBoxSelection) this.createSale(element)
    } else {
      if (checkBoxSelection) this.updateSale(element)
    }
  }

  async updateSale(element: any) {
    try {
      this.spinner.showSpinner(true);
      const { customer_id, distribution_id, product_inventory_id, user_name, ...sale } = element.sale
      await this.saleService.updateSale({ ...sale, payment_method: element.payment_method });
      await this.clientService.updateClient({ id: element.id, is_served: true });
      showPopUp('Venta actualizada con exito', 'success')
      this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    } catch (error) {
      showPopUp('Error al actualizar la venta', 'error')
    }
    this.spinner.showSpinner(false);
  }

  async createSale(element: any) {
    try {
      this.spinner.showSpinner(true);
      if (element.order || element.quantity != '-') {
        await this.saleService.createSale({
          amount: element.order ? element.order.amount : element.quantity == '-' ? 0 : element.quantity,
          unit_value: element.unit_value,
          customer_id: element.id,
          distribution_id: this.preSaleStorage.actualDistribution!.id,
          value_paid: element.value_paid,
          user_id: this.appStorage.user.id,
          product_inventory_id: 1,
          payment_method: element.payment_method
        });
      }
      await this.clientService.updateClient({ id: element.id, is_served: true });
      showPopUp('Cliente atendido con exito', 'success')
      this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    } catch (error) {
      showPopUp('Error al registrar la venta', 'error')
    }
    this.spinner.showSpinner(false);
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

  getTotalProductsSelled(isDistribuidor: boolean) {
    let total = 0
    for (const client of this.dataSource.data) {
      total += isDistribuidor ? client.sale ? client.sale.amount : 0 : client.order ? client.order.amount : client.quantity != '-' ? client.quantity : 0
    }
    return total
  }

  getTotalClientsAnswered(isDistribuidor: boolean) {
    let total = 0
    for (const client of this.dataSource.data) {
      total += isDistribuidor ? client.is_served ? 1 : 0 : client.order ? 1 : 0
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
      this.filter = `${textOrEvent}`
      await this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    }
  }

  async clearFilter(input: HTMLInputElement) {
    this.filter = undefined
    await this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route)
    input.value = ''
  }

  openDialog(index: number, element: any) {
    this.preSaleStorage.actualClientDistribution = element
    this.preSaleStorage.actualClient = element
    switch (index) {
      case 0:
        this.modalService.open(QuantyInputModalComponent)
        break;
      case 1:
        this.modalService.open(ValuePaidModalComponent)
        break;
      case 2:
        this.expenseStorage.actualExpense = null
        this.expenseStorage.isUpdateCreationExpense = false
        this.modalService.open(ExpenseComponent)
        break;
      case 3:
        this.modalService.open(CloseRequestDistributionComponent)
        break;
    }
  }
}
