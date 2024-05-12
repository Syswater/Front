import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { MaterialModule } from '../material/material.module';
import { ClientsFormComponent } from './components/clients-form/clients-form.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { DeleteNoteComponent } from './components/clients-form/components/delete-note/delete-note.component';
import { PaymentModalComponent } from './components/clients-form/components/payment-modal/payment-modal.component';
import { ContainersModalComponent } from './components/clients-form/components/containers-modal/containers-modal.component';

@NgModule({
  declarations: [
    ClientsComponent,
    ClientsFormComponent,
    DeleteModalComponent,
    DeleteNoteComponent,
    PaymentModalComponent,
    ContainersModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ClientsModule { }
