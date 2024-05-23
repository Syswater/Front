import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesComponent } from './routes.component';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { DeleteRouteModalComponent } from './components/delete-route-modal/delete-route-modal.component';
import { ConfirmRejectDistributionComponent } from './components/confirm-reject-distribution/confirm-reject-distribution.component';
import { ConfirmAcceptDistributionComponent } from './components/confirm-accept-distribution/confirm-accept-distribution.component';
import { InitDistributionFormComponent } from './components/init-distribution-form/init-distribution-form.component';
import { ModalReportDistributionComponent } from './components/modal-report-distribution/modal-report-distribution.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RoutesComponent,
    RouteFormComponent,
    DeleteRouteModalComponent,
    ConfirmRejectDistributionComponent,
    ConfirmAcceptDistributionComponent,
    InitDistributionFormComponent,
    ModalReportDistributionComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    DashboardModule,
    NgxChartsModule,
    RouterModule
  ]
})

export class RoutesModule { }
