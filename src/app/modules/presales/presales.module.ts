import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresalesComponent } from './presales.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PresalesFormComponent } from './components/presales-form/presales-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteOrderComponent } from './components/delete-order/delete-order.component';
import { QuantyInputModalComponent } from './components/quanty-input-modal/quanty-input-modal.component';
import { ExpenseComponent } from './components/expense/expense.component';
import { ValuePaidModalComponent } from './components/value-paid-modal/value-paid-modal.component';
import { CloseRequestDistributionComponent } from './components/close-request-distribution/close-request-distribution.component';
import { BrokenContainersModalComponent } from './components/broken-containers-modal/broken-containers-modal.component';

@NgModule({
  declarations: [
    PresalesComponent,
    PresalesFormComponent,
    DeleteOrderComponent,
    QuantyInputModalComponent,
    ExpenseComponent,
    ValuePaidModalComponent,
    CloseRequestDistributionComponent,
    BrokenContainersModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PresalesModule { }
