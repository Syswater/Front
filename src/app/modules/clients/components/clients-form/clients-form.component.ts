import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ModalService } from 'src/data/services/modal.service';
import { ClientStorage } from '../../client.storage';
import { FormBuilder } from '@angular/forms';
import { Route } from 'src/data/models/route';
import { RouteService } from 'src/data/services/route.service';
import { SpinnerService } from 'src/data/services/spinner.service';

const observations_data = [
  { index: 0, text: 'Tocar segundo piso', importance: 2, editable: false },
  { index: 1, text: 'Dejar 2 por hoy', importance: 1, editable: false },
];

const abonos_data = [
  {
    index: 0,
    date: moment().format('DD/MM/YYYY'),
    price: '$20.000',
    method: 'Nequi',
    type: 'Abono',
    total: '$15.000',
  },
  {
    index: 1,
    date: moment().format('DD/MM/YYYY'),
    price: '$20.000',
    method: 'Nequi',
    type: 'Abono',
    total: '$15.000',
  },
  {
    index: 2,
    date: moment().format('DD/MM/YYYY'),
    price: '$20.000',
    method: 'Nequi',
    type: 'Abono',
    total: '$15.000',
  },
];

const envases_data = [
  {
    index: 0,
    date: moment().format('DD/MM/YYYY'),
    quanty: 1,
    type: 'Devolución',
    total: 3,
  },
  {
    index: 1,
    date: moment().format('DD/MM/YYYY'),
    quanty: 1,
    type: 'Devolución',
    total: 3,
  },
  {
    index: 2,
    date: moment().format('DD/MM/YYYY'),
    quanty: 1,
    type: 'Devolución',
    total: 3,
  },
];

const ventas_data = [
  {
    index: 0,
    date: moment().format('DD/MM/YYYY'),
    product: 'Agua',
    quanty: 1,
    price: '$20.000',
    total: '$20.000',
  },
  {
    index: 1,
    date: moment().format('DD/MM/YYYY'),
    product: 'Agua',
    quanty: 1,
    price: '$20.000',
    total: '$20.000',
  },
  {
    index: 2,
    date: moment().format('DD/MM/YYYY'),
    product: 'Agua',
    quanty: 1,
    price: '$20.000',
    total: '$20.000',
  },
];

@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.css'],
})
export class ClientsFormComponent implements OnInit {
  displayedColumns: string[] = ['Observación', 'Prioridad', 'Acciones'];
  displayedColumnsAbonos: string[] = [
    'Fecha',
    'Precio',
    'Medio',
    'Tipo',
    'Total',
  ];
  displayedColumnsEnvases: string[] = ['Fecha', 'Cantidad', 'Tipo', 'Total'];
  displayedColumnsVentas: string[] = [
    'Fecha',
    'Producto',
    'Cantidad',
    'Precio',
    'Total',
  ];
  tape_preference = ['NORMAL', 'SERVIFACIL'];
  dataSource = observations_data;
  dataSourceAbonos = abonos_data;
  dataSourceEnvases = envases_data;
  dataSourceVentas = ventas_data;
  client = this.clientStorage.actualClient;
  formClient = this.formBuilder.group({
    name: this.client?.name,
    cellphone: this.client?.cellphone,
    envases: this.client?.address, // pendiente
    address: this.client?.address,
    neighborhood: this.client?.neighborhood,
    tape_preference: this.client?.tape_preference,
    deuda: this.client?.tape_preference, // pendiente
    route_id: this.client?.route_id,
  });
  routes: Route[] = []

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ClientsFormComponent>,
    private modalService: ModalService,
    public clientStorage: ClientStorage,
    private routeService: RouteService,
    private spinnerService: SpinnerService
  ) {}

  async ngOnInit() {
    this.spinnerService.showSpinner(true)
    this.routes = await this.routeService.getRoutes();
    this.spinnerService.showSpinner(false)
  }

  showDelete(element: any) {
    this.modalService.open(ClientsFormComponent, () => {});
  }

  edit(index: number) {
    this.dataSource[index].editable = !this.dataSource[index].editable;
  }

  close(){
    this.dialogRef.close()
  }

  createOrUpdate(){
    
  }
}
