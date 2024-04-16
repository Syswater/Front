import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ModalService } from 'src/data/services/modal.service';
import { ClientStorage } from '../../client.storage';
import { FormBuilder } from '@angular/forms';
import { Route } from 'src/data/models/route';
import { RouteService } from 'src/data/services/route.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { Observation } from 'src/data/models/observation';
import { ClientService } from 'src/data/services/client.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';

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
  dataSource = new MatTableDataSource<any>([]);
  dataSourceAbonos = abonos_data;
  dataSourceEnvases = envases_data;
  dataSourceVentas = ventas_data;
  client = this.clientStorage.actualClient;
  formClient = this.formBuilder.group({
    name: this.client?.name,
    cellphone: this.client?.cellphone,
    envases: this.client?.borrowedContainers, // pendiente
    address: this.client?.address,
    neighborhood: this.client?.neighborhood,
    tape_preference: this.client?.tape_preference,
    deuda: this.client?.tape_preference, // pendiente
    route_id: this.client?.route_id,
  });
  routes: Route[] = [];
  temporalId: number = -1;
  temporalPostUpdateNote!: [any, 'POST' | 'UPDATE'];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ClientsFormComponent>,
    private modalService: ModalService,
    public clientStorage: ClientStorage,
    private routeService: RouteService,
    private spinnerService: SpinnerService,
    private clientService: ClientService
  ) { }

  async ngOnInit() {
    this.spinnerService.showSpinner(true);
    this.routes = await this.routeService.getRoutes();
    this.dataSource.data = (
      this.clientStorage.actualClient
        ? this.clientStorage.actualClient.note
        : []
    ).map((note) => ({ editable: false, ...note }));
    this.spinnerService.showSpinner(false);
  }

  showDelete(element: any) {
    this.modalService.open(ClientsFormComponent, () => { });
  }

  edit(id: number, clickCheck: boolean) {
    const index = this.dataSource.data.findIndex((d: any) => d.id == id);
    this.dataSource.data[index].editable =
      !this.dataSource.data[index].editable;
    if (clickCheck) this.createOrUpdateNote()
  }

  close() {
    this.dialogRef.close();
  }

  createOrUpdate() { }

  addNote() {
    this.dataSource.data.push({
      editable: true,
      id: -1,
      description: 'Nueva observación',
      distribution_id: this.clientStorage.actualRoute
        ? this.clientStorage.actualRoute.id
        : null,
      customer_id: this.clientStorage.actualClient?.id,
    });
    this.clientStorage.actualClient?.note.push({
      id: this.temporalId--,
      description: 'Nueva observación',
      distribution_id: this.clientStorage.actualRoute
        ? this.clientStorage.actualRoute.id
        : null,
      customer_id: this.clientStorage.actualClient.id,
    });
    this.dataSource.data = [...this.dataSource.data];
  }

  selectNoteType($event: MatSelectChange, element: any) {
    if (this.clientStorage.actualClient && this.clientStorage.actualRoute) {
      const index = this.clientStorage.actualClient.note.findIndex(
        (note) => note.id == element.id
      );
      if (
        this.clientStorage.actualClient.note[index] &&
        this.clientStorage.actualClient.note[index].distribution_id
      )
        this.clientStorage.actualClient.note[index].distribution_id =
          $event.value == '2' ? null : this.clientStorage.actualRoute.id;
      const indexData = this.dataSource.data.findIndex(
        (note) => note.id == element.id
      );
      if (
        this.dataSource.data[indexData] &&
        this.dataSource.data[indexData].distribution_id
      )
        this.dataSource.data[indexData].distribution_id =
          $event.value == '2' ? null : this.clientStorage.actualRoute.id;
      this.dataSource.data = [...this.dataSource.data];

      this.temporalPostUpdateNote =
        this.dataSource.data[indexData].id < 0
          ? [this.dataSource.data[indexData], 'POST']
          : [this.dataSource.data[indexData], 'UPDATE'];
    }
  }

  async createOrUpdateNote() {
    this.spinnerService.showSpinner(true)
    delete this.temporalPostUpdateNote[0].editable
    if (this.temporalPostUpdateNote[1] == 'POST') {
      try {
        delete this.temporalPostUpdateNote[0].id
        await this.clientService.createNote(this.temporalPostUpdateNote[0]);
        showPopUp('Observación creada con éxito', 'success')
      } catch (error) {
        showPopUp('Error al crear la observación', 'error')
      }
    } else {
      try {
        await this.clientService.updateNote(this.temporalPostUpdateNote[0]);
        showPopUp('Observación actualizada con éxito', 'success')
      } catch (error) {
        showPopUp('Error al actualizar la observación', 'error')
      }
    }
    this.spinnerService.showSpinner(false)
  }
}
