import { Component } from '@angular/core';
import { ExpensesStorage } from '../../expenses.storage';
import { ExpensesService } from 'src/data/services/expenses.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-expense',
  templateUrl: './delete-confirm-expense.component.html',
  styleUrls: ['./delete-confirm-expense.component.css'],
})
export class DeleteConfirmExpenseComponent {
  constructor(
    private spinner: SpinnerService,
    public expenseStorage: ExpensesStorage,
    private expenseService: ExpensesService,
    private dialogRef: MatDialogRef<DeleteConfirmExpenseComponent>
  ) {}

  async deleteExpense() {
    try {
      this.spinner.showSpinner(true);
      await this.expenseService.deleteExpense(
        this.expenseStorage.actualExpense!.id
      );
      this.dialogRef.close()
      this.expenseStorage.setObservableValue(true, 'reloadExpenses')
      showPopUp('Gasto eliminado con éxito', 'success');
    } catch (error) {
      showPopUp('Error al eliminar el gasto', 'error');
    }
    this.spinner.showSpinner(false);
  }
}
