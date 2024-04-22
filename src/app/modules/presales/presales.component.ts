import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalService } from 'src/data/services/modal.service';
import { Observation } from 'src/data/models/observation';
import { PresalesFormComponent } from './components/presales-form/presales-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { PresalesService } from 'src/data/services/presales.service';

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
  styleUrls: ['./presales.component.css']
})
export class PresalesComponent implements OnInit {
  displayedColumns: string[] = ['Orden', 'Cliente', 'Telefono', 'Cantidad', 'Deudas', 'Envases Prestados', 'Observaciones', 'Atendido', 'Acciones'];
  dataSource = new MatTableDataSource<any>([]);
  disableSelect = new FormControl(false);

  constructor(private modalService: ModalService, private presalesService: PresalesService) {}

  async ngOnInit() {
    this.dataSource.data = await this.presalesService.getPresales({ distribution_id: 1});
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
}
