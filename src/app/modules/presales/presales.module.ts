import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresalesComponent } from './presales.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PresalesFormComponent } from './components/presales-form/presales-form.component';



@NgModule({
  declarations: [
    PresalesComponent,
    PresalesFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule
  ]
})
export class PresalesModule { }
