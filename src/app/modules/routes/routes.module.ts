import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    RoutesComponent,
    RouteFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})

export class RoutesModule { }
