import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalService } from 'src/data/services/modal.service';
import { ClientsFormComponent } from '../clients/components/clients-form/clients-form.component';
import { Observation } from 'src/data/models/observation';
import { PresalesFormComponent } from './components/presales-form/presales-form.component';

export interface Client {
  order: number;
  client: string;
  phoneNumber: string;
  debt: number;
  borrowedPackaging: number;
  quantity: number;
  observations: Observation[];
}

const ELEMENT_DATA: Client[] = [
];

@Component({
  selector: 'app-presales',
  templateUrl: './presales.component.html',
  styleUrls: ['./presales.component.css']
})
export class PresalesComponent {
  displayedColumns: string[] = ['Orden', 'Cliente', 'Telefono', 'Cantidad', 'Deudas', 'Envases Prestados', 'Observaciones', 'Atendido', 'Acciones'];
  dataSource = ELEMENT_DATA;
  disableSelect = new FormControl(false);

  constructor(private modalService: ModalService) {}

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
}
