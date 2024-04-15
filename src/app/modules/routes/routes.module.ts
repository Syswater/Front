import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { MaterialModule } from '../material.module';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';

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
