import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { DeleteNoteComponent } from './components/delete-note/delete-note.component';

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
export class ClientsFormComponent implements OnInit, OnDestroy {
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
    id: this.client?.id,
    address: this.client?.address,
    neighborhood: this.client?.neighborhood,
    route_order: this.client?.route_order ? this.client.route_order : this.clientStorage.lastClient ? this.clientStorage.lastClient.route_order + 1 : 0,
    tape_preference: this.client ? this.client.tape_preference : this.tape_preference[0],
    is_contactable: [this.client ? this.client.is_contactable : this.clientStorage.actualClient?.is_contactable],
    name: this.client?.name,
    cellphone: this.client?.cellphone,
    borrowedContainers: this.client?.borrowedContainers ?? 0,
    totalDebt: this.client?.totalDebt ?? 0,
    route_id: this.client ? this.client.route_id : this.clientStorage.actualRoute?.id,
  });
  routes: Route[] = [];
  temporalId: number = -1;
  temporalPostUpdateNote: any[] = [];
  updateClientFields: any = {}
  $subscription!: Subscription

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ClientsFormComponent>,
    private modalService: ModalService,
    public clientStorage: ClientStorage,
    private routeService: RouteService,
    private spinnerService: SpinnerService,
    private clientService: ClientService
  ) { }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe()
  }

  async ngOnInit() {
    this.spinnerService.showSpinner(true);
    this.routes = await this.routeService.getRoutes();
    this.dataSource.data = (
      this.clientStorage.actualClient
        ? this.clientStorage.actualClient.note
        : []
    ).map((note) => ({ editable: false, ...note }));
    this.spinnerService.showSpinner(false);
    this.initUpdateObserver();
  }

  initUpdateObserver() {
    this.$subscription = this.formClient.valueChanges.subscribe(value => {
      console.log(value)
    })
  }

  showDelete(element: Observation) {
    this.clientStorage.deleteNote = element
    this.modalService.open(DeleteNoteComponent, ()=> {
      this.dialogRef.close()
    });
  }

  edit(id: number, clickCheck: boolean) {
    const index = this.dataSource.data.findIndex((d: any) => d.id == id);
    this.dataSource.data[index].editable =
      !this.dataSource.data[index].editable;
    if (clickCheck && id < 0) {
      this.createNote(id)
    } else if(clickCheck && id > 0) {
      this.updateNote(id);
    }
  }

  close() {
    this.dialogRef.close();
  }

  addNote() {
    const temporalNote = {
      editable: true,
      id: this.temporalId--,
      description: 'Nueva observación',
      distribution_id: this.clientStorage.actualRoute
        ? this.clientStorage.actualRoute.id
        : null,
      customer_id: this.clientStorage.actualClient?.id,
    }
    this.dataSource.data.push(temporalNote);
    this.clientStorage.actualClient?.note.push(temporalNote as Observation);
    this.temporalPostUpdateNote.push(temporalNote)
    this.dataSource.data = [...this.dataSource.data];
  }

  changeDescriptionNote(event: Event, element: any) {
    if (this.clientStorage.actualClient && this.clientStorage.actualRoute) {
      const value = (event.target as HTMLInputElement).value

      const index = this.clientStorage.actualClient.note.findIndex((note) => note.id == element.id);
      if (this.clientStorage.actualClient.note[index]) this.clientStorage.actualClient.note[index].description = value

      const indexData = this.dataSource.data.findIndex((note) => note.id == element.id);
      if (this.dataSource.data[indexData]) this.dataSource.data[indexData].description = value

      this.dataSource.data = [...this.dataSource.data];

      const indexTemporal = this.temporalPostUpdateNote.findIndex((temp) => temp.id == element.id);
      if (this.temporalPostUpdateNote[indexTemporal]) this.temporalPostUpdateNote[indexTemporal].description = value

    }
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

      const indexTemporal = this.temporalPostUpdateNote.findIndex((temp) => temp.id == element.id);
      if (this.temporalPostUpdateNote[indexTemporal]) this.temporalPostUpdateNote[indexTemporal].distribution_id = $event.value == '2' ? null : this.clientStorage.actualRoute.id
    }
  }

  async createNote(id: number) {
    try {
      this.spinnerService.showSpinner(true)
      const temporalNote = this.temporalPostUpdateNote.find(temp => temp.id == id) || []
      const indexTmp = this.dataSource.data.findIndex(note => note.id == id)
      delete temporalNote.editable
      delete temporalNote.id
      const note = await this.clientService.createNote(temporalNote);
      this.dataSource.data[indexTmp].id = note.id
      this.clientStorage.actualClient?.note.push(note as Observation)
      showPopUp('Observación creada con éxito', 'success')
      this.clientStorage.setObservableValue(true, 'reloadClients')
    } catch (error) {
      showPopUp('Error al crear la observación', 'error')
    }
    this.spinnerService.showSpinner(false)
  }

  async updateNote(id: number) {
    try {
      this.spinnerService.showSpinner(true)
      const note = this.dataSource.data.find(data => data.id == id)
      delete note.editable
      await this.clientService.updateNote(note);
      showPopUp('Observación actualizada con éxito', 'success')
      this.clientStorage.setObservableValue(true, 'reloadClients')
    } catch (error) {
      showPopUp('Error al actualizar la observación', 'error')
    }
  }

  async createClient() {
    try {
      this.spinnerService.showSpinner(true)
      const { borrowedContainers, totalDebt, id, ...client } = this.formClient.value
      //Campos opcionales
      if (!client.neighborhood) delete client.neighborhood
      if (!client.cellphone) delete client.cellphone
      if (!client.name) delete client.name

      if (client.cellphone) client.cellphone = `${client.cellphone}`
      await this.clientService.createClient(client)
      showPopUp('Cliente creado con éxito', 'success')
      this.clientStorage.setObservableValue(true, 'reloadClients')
    } catch (error) {
      showPopUp('Error al crear el cliente', 'error')
    }
    this.spinnerService.showSpinner(false)
    this.dialogRef.close()
  }

  async updateClient() {
    try {
      this.spinnerService.showSpinner(true)
      const { borrowedContainers, totalDebt, ...client } = this.formClient.value
      await this.clientService.updateClient(client)
      showPopUp('Cliente actualizado con éxito', 'success')
      this.clientStorage.setObservableValue(true, 'reloadClients')
    } catch (error) {
      showPopUp('Error al actualizar el cliente', 'error')
    }
    this.spinnerService.showSpinner(false)
    this.dialogRef.close()
  }
}
