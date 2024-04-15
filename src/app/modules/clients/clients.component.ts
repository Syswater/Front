import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observation } from 'src/data/models/observation';
import { ModalService } from 'src/data/services/modal.service';
import { ClientsFormComponent } from './components/clients-form/clients-form.component';
import { ClientService } from 'src/data/services/client.service';
import { Client } from 'src/data/models/client';
import { ClientStorage } from './client.storage';
import { Route } from 'src/data/models/route';
import { RouteService } from 'src/data/services/route.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
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
  disableSelect = new FormControl(false);
  routes: Route[] = [];

  constructor(
    private spinner: SpinnerService,
    private modalService: ModalService,
    private clientService: ClientService,
    public clientStorage: ClientStorage,
    private routeService: RouteService
  ) {}

  async ngOnInit() {
    await this.reload();
  }

  async reload(){
    this.spinner.showSpinner(true);
    this.routes = await this.routeService.getRoutes();
    this.clientStorage.actualRoute = this.routes[0];
    this.dataSource = await this.clientService.getListClients(this.clientStorage.actualRoute.id, undefined, true);
    this.spinner.showSpinner(false);
  }

  showDialogClient(element: Client | null, flag: number) {
    this.clientStorage.actualClient = element;
    switch (flag) {
      case 1:
        this.modalService.open(ClientsFormComponent, () => {});
        break;
      case 2:
        this.modalService.open(DeleteModalComponent, () => {
          this.reload().then()
        });
        break;
    }
  }
}
