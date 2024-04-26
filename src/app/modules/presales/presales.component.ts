import { Component, OnInit } from '@angular/core';
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
export class PresalesComponent implements OnInit {
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

  constructor(
    private clientService: ClientService,
    public preSaleStorage: PresalesStorage,
    private spinner: SpinnerService,
    private modalService: ModalService,
    private distributionService: DistributionService
  ) { }

  async ngOnInit() {
    await this.getDistributions();
    await this.getClientsByRoute(this.preSaleStorage.actualDistribution?.route);
  }

  async getClientsByRoute(route: Route | undefined | null) {
    this.spinner.showSpinner(true);
    this.dataSource.data = (await this.clientService.getListClients({
      route_id: this.preSaleStorage.actualDistribution
        ? this.preSaleStorage.actualDistribution.route_id
        : 0,
      distribution_id: this.preSaleStorage.actualDistribution?.id,
      with_notes: true,
      with_order: true
    }));
    this.spinner.showSpinner(false);
  }

  async getDistributions() {
    this.spinner.showSpinner(true);
    this.distributions = await this.distributionService.getDistributions({ status: 'PREORDER', with_route: true })
    this.preSaleStorage.actualDistribution = this.distributions[0]
    this.spinner.showSpinner(false);
  }

  showDialogClient(element: any, flag: number) {
    switch (flag) {
      case 1:
        this.modalService.open(PresalesFormComponent, () => { });
        break;
      case 2:
        this.modalService.open(PresalesFormComponent, () => { });
        break;
    }
  }

  changeRoute(event: any) {
    this.getClientsByRoute(this.distributions.find((r: Distribution) => r.route.id == event.value)?.route);
  }
}
