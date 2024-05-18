import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/data/services/modal.service';
import { ClientsFormComponent } from './components/clients-form/clients-form.component';
import { ClientService } from 'src/data/services/client.service';
import { Client } from 'src/data/models/client';
import { ClientStorage } from './client.storage';
import { Route } from 'src/data/models/route';
import { RouteService } from 'src/data/services/route.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { Subscription } from 'rxjs';
import { AppStorage } from 'src/app/app.storage';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'Orden',
    'Cliente',
    'Telefono',
    'Deudas',
    'Envases prestados',
    'Observaciones',
    'Acciones',
  ];
  dataSource: Client[] = [];
  routes: Route[] = [];
  filter?: string;
  reloadClients!: Subscription

  constructor(
    private spinner: SpinnerService,
    private modalService: ModalService,
    private clientService: ClientService,
    public clientStorage: ClientStorage,
    private routeService: RouteService,
    public appStorage: AppStorage
  ) { }

  ngOnDestroy(): void {
    this.reloadClients.unsubscribe()
    this.clientStorage.actualRoute = null
    this.clientStorage.actualClient = null
  }

  async ngOnInit() {
    this.reloadClients = this.clientStorage.getObservable('reloadClients').subscribe(v => this.reload() );
    await this.reload();
  }

  changeRoute(event: any) {
    const route = this.routes.find((r) => r.id == event.value)
    localStorage.setItem('client-actualRoute', JSON.stringify(route))
    this.getClientsByRoute(route);
  }

  async reload() {
    await this.getRoutes();
    if(!localStorage.getItem('client-actualRoute')) localStorage.setItem('client-actualRoute', JSON.stringify(this.routes[0]))
    await this.getClientsByRoute(JSON.parse(`${localStorage.getItem('client-actualRoute')}`));
  }

  async getClientsByRoute(route: Route | undefined | null) {
    this.spinner.showSpinner(true);
    this.clientStorage.actualRoute = route;
    this.dataSource = await this.clientService.getListClients({
      route_id: this.clientStorage.actualRoute
        ? this.clientStorage.actualRoute.id
        : 0,
      filter: this.filter,
      with_notes: true,
    });
    this.spinner.showSpinner(false);
    this.clientStorage.lastClient = this.dataSource[this.dataSource.length - 1]
  }

  async getRoutes() {
    this.spinner.showSpinner(true);
    this.routes = await this.routeService.getRoutes();
    this.spinner.showSpinner(false);
  }

  showDialogClient(element: Client | null, flag: number) {
    this.clientStorage.actualClient = element;
    switch (flag) {
      case 1:
        this.modalService.open(ClientsFormComponent, () => { });
        break;
      case 2:
        this.modalService.open(DeleteModalComponent, () => { });
        break;
    }
  }

  async filterClients(textOrEvent: string | KeyboardEvent) {
    if (textOrEvent instanceof KeyboardEvent) {
      const event = textOrEvent as KeyboardEvent;
      const keyPressed = event.key; // La tecla presionada.
      const inputText = (event.target as HTMLInputElement).value;
      if (keyPressed == 'Enter') {
        this.filter = inputText
        await this.getClientsByRoute(this.clientStorage.actualRoute)
      }
    } else {
      this.filter = `${textOrEvent}`
      await this.getClientsByRoute(this.clientStorage.actualRoute)
    }
  }

  async clearFilter(input: HTMLInputElement) {
    this.filter = undefined
    await this.getClientsByRoute(this.clientStorage.actualRoute)
    input.value = ''
  }

  getTotalDebtAndEnvases() {
    let totalDebt = 0, totalEnvases = 0
    for (const client of this.dataSource) {
      totalDebt += client.totalDebt ?? 0
      totalEnvases += client.borrowedContainers ?? 0
    }
    return { totalDebt, totalEnvases}
  }
}
