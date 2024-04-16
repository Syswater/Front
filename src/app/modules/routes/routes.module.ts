import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { DeleteRouteModalComponent } from './components/delete-route-modal/delete-route-modal.component';

@NgModule({
  declarations: [
    RoutesComponent,
    RouteFormComponent,
    DeleteRouteModalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})

export class RoutesModule { }
