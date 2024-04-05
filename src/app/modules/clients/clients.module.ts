import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    ClientsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ClientsModule { }
