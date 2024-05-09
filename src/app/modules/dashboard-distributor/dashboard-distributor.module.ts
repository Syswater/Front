import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDistributorComponent } from './dashboard-distributor.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    DashboardDistributorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    DashboardModule,
    NgxChartsModule
  ]
})
export class DashboardDistributorModule { }
