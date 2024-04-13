import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    RoutesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ]
})
export class RoutesModule { }
