import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { ModalService } from 'src/data/services/modal.service';

const observations_data = [
  { index: 0, text: 'Tocar segundo piso', importance: 2, editable: false },
  { index: 1, text: 'Dejar 2 por hoy', importance: 1, editable: false },
]

const abonos_data = [
  { index: 0, date: moment().format('DD/MM/YYYY'), price: '$20.000', method: 'Nequi', type: 'Abono', total: '$15.000' },
  { index: 1, date: moment().format('DD/MM/YYYY'), price: '$20.000', method: 'Nequi', type: 'Abono', total: '$15.000' },
  { index: 2, date: moment().format('DD/MM/YYYY'), price: '$20.000', method: 'Nequi', type: 'Abono', total: '$15.000' },
]

const envases_data = [
  { index: 0, date: moment().format('DD/MM/YYYY'), quanty: 1, type: 'Devolución', total: 3 },
  { index: 1, date: moment().format('DD/MM/YYYY'), quanty: 1, type: 'Devolución', total: 3 },
  { index: 2, date: moment().format('DD/MM/YYYY'), quanty: 1, type: 'Devolución', total: 3 },
]

const ventas_data = [
  { index: 0, date: moment().format('DD/MM/YYYY'), product: 'Agua', quanty: 1, price: '$20.000', total: '$20.000' },
  { index: 1, date: moment().format('DD/MM/YYYY'), product: 'Agua', quanty: 1, price: '$20.000', total: '$20.000' },
  { index: 2, date: moment().format('DD/MM/YYYY'), product: 'Agua', quanty: 1, price: '$20.000', total: '$20.000' },
]


@Component({
  selector: 'app-clients-form',
  templateUrl: './clients-form.component.html',
  styleUrls: ['./clients-form.component.css']
})
export class ClientsFormComponent {

  displayedColumns: string[] = ['Observación', 'Prioridad', 'Acciones'];
  displayedColumnsAbonos: string[] = ['Fecha', 'Precio', 'Medio', 'Tipo', 'Total'];
  displayedColumnsEnvases: string[] = ['Fecha', 'Cantidad', 'Tipo', 'Total'];
  displayedColumnsVentas: string[] = ['Fecha', 'Producto', 'Cantidad', 'Precio', 'Total'];
  dataSource = observations_data;
  dataSourceAbonos = abonos_data;
  dataSourceEnvases = envases_data;
  dataSourceVentas = ventas_data;

  constructor(private dialogRef: MatDialogRef<ClientsFormComponent>, private modalService: ModalService) { }

  showDelete(element: any) {
    this.modalService.open(ClientsFormComponent, () => { });
  }

  edit(index: number){
    this.dataSource[index].editable = !this.dataSource[index].editable
  }
}
