import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresalesComponent } from './presales.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PresalesFormComponent } from './components/presales-form/presales-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteOrderComponent } from './components/delete-order/delete-order.component';



@NgModule({
  declarations: [
    PresalesComponent,
    PresalesFormComponent,
    DeleteOrderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class PresalesModule { }
