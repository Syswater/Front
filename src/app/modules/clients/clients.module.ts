import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { MaterialModule } from '../material.module';
import { ClientsFormComponent } from './components/clients-form/clients-form.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ClientsComponent,
    ClientsFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ]
})
export class ClientsModule { }
