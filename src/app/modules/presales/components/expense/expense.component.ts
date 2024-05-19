import { Component, Inject, OnInit } from '@angular/core';
import { AppStorage } from 'src/app/app.storage';
import { PresalesStorage } from '../../presales.storage';
import { ExpenseCategory } from 'src/data/models/expense-category';
import { ExpensesService } from 'src/data/services/expenses.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getStartDayCurrent } from 'src/app/utils/DateUtils';
import { SpinnerService } from 'src/data/services/spinner.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { ExpensesStorage } from 'src/app/modules/expenses/expenses.storage';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent implements OnInit {
  expensesCategories: ExpenseCategory[] = [];
  formExpense: FormGroup = this.fb.group({
    value: [this.expensesStorage.actualExpense ? this.expensesStorage.actualExpense.value : 0, Validators.min(0)],
    date: getStartDayCurrent(),
    description: [this.expensesStorage.actualExpense ? this.expensesStorage.actualExpense.description : '', Validators.required],
    distribution_id: this.preSaleStorage.actualDistribution!.id,
    expense_category_id: [this.expensesStorage.actualExpense ? this.expensesStorage.actualExpense.expense_category_id : '', Validators.required]
  })

  constructor(
    public appStorage: AppStorage,
    public preSaleStorage: PresalesStorage,
    private expensesService: ExpensesService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private fb: FormBuilder,
    private spinner: SpinnerService,
    public expensesStorage: ExpensesStorage,
    private dialogRef: MatDialogRef<ExpenseComponent>
  ) { }

  async ngOnInit() {
    this._locale = 'es';
    this._adapter.setLocale(this._locale);
    this.expensesCategories = await this.expensesService.getExpensesCategories()
  }

  async createExpense() {
    try {
      this.spinner.showSpinner(true)
      await this.expensesService.createCategory(this.formExpense.value);
      showPopUp('Gasto creado con éxito', 'success')
      this.expensesStorage.setObservableValue(true, 'reloadExpenses')
      this.dialogRef.close()
    } catch (error) {
      showPopUp('Error al crear el gasto', 'error')
    }
    this.spinner.showSpinner(false)
  }

  async updateExpense() {
    try {
      this.spinner.showSpinner(true)
      const { date, distribution_id, ...expense } = this.formExpense.value
      await this.expensesService.updateCategory({ ...expense, id: this.expensesStorage.actualExpense!.id });
      showPopUp('Gasto actualizado con éxito', 'success')
      this.expensesStorage.setObservableValue(true, 'reloadExpenses')
      this.dialogRef.close()
    } catch (error) {
      showPopUp('Error al actualizar el gasto', 'error')
    }
    this.spinner.showSpinner(false)
  }
}
