import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from '../material.module';
import { CardInfoComponent } from './components/card-info/card-info.component';
import { CardComponent } from './components/card/card.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CardComponent,
    CardInfoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class DashboardModule { }
