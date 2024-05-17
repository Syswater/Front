import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../material/material.module';
import { CardInfoComponent } from './components/card-info/card-info.component';
import { CardComponent } from './components/card/card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    CardInfoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxChartsModule,
    SharedModule
  ],
  exports: [
    CardComponent,
    CardInfoComponent
  ]
})
export class DashboardModule { }
