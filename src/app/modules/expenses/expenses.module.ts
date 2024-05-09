import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpensesComponent } from './expenses.component';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { DeleteConfirmExpenseComponent } from './components/delete-confirm-expense/delete-confirm-expense.component';

@NgModule({
  declarations: [
    ExpensesComponent,
    DeleteConfirmExpenseComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ]
})
export class ExpensesModule { }
