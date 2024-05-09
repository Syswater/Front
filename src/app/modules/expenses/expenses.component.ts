import { Component, OnDestroy, OnInit } from '@angular/core';
import { Distribution } from 'src/data/models/distribution';
import { ExpensesStorage } from './expenses.storage';
import { ModalService } from 'src/data/services/modal.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { ExpenseComponent } from '../presales/components/expense/expense.component';
import { MatTableDataSource } from '@angular/material/table';
import { ExpensesService } from 'src/data/services/expenses.service';
import { DistributionService } from 'src/data/services/distribution.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ExpenseCategory } from 'src/data/models/expense-category';
import { MatSelectChange } from '@angular/material/select';
import { formatDate } from 'src/app/utils/DateUtils';
import { PresalesStorage } from '../presales/presales.storage';
import { Subscription } from 'rxjs';
import { DeleteConfirmExpenseComponent } from './components/delete-confirm-expense/delete-confirm-expense.component';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit, OnDestroy {
  distributions: Distribution[] = [];
  filter_expense_category?: number;
  dataSource = new MatTableDataSource<any>([]);
  role: string = ''
  categories: ExpenseCategory[] = []
  displayedColumns: string[] = [
    'Fecha',
    'Descripcion',
    'Valor',
    'Categoria',
    'Acciones'
  ];
  $reloadTable!: Subscription

  constructor(
    public expensesStorage: ExpensesStorage,
    private modalService: ModalService,
    private spinner: SpinnerService,
    private expensesService: ExpensesService,
    private distributionService: DistributionService,
    private jwtHelper: JwtHelperService,
    private presaleStorage: PresalesStorage
  ) { }

  ngOnDestroy(): void {
    this.$reloadTable.unsubscribe()
  }

  async ngOnInit() {
    this.$reloadTable = this.expensesStorage.getObservable('reloadExpenses').subscribe(() => { 
      this.spinner.showSpinner(true);
      this.getExpensesByDistribution(this.expensesStorage.actualDistribution!) 
      this.spinner.showSpinner(false);
    })
    this.spinner.showSpinner(true);
    this.role = `${localStorage.getItem('roleActual')}`
    await this.getExpensesCategories();
    await this.getDistributions();
    await this.getExpensesByDistribution(this.expensesStorage.actualDistribution!);
    this.spinner.showSpinner(false);
  }
  
  async getExpensesCategories() {
    this.categories = await this.expensesService.getExpensesCategories();
  }
  
  async getDistributions() {
    this.distributions = await this.distributionService.getDistributions({
      status: 'OPENED', with_route: true, distributor_id: this.jwtHelper.decodeToken(`${localStorage.getItem('token')}`).user.id
    })
    this.expensesStorage.actualDistribution = this.distributions.length > 0 ? this.distributions[0] : null
  }
  
  async filterExpenses(event: MatSelectChange) {
    this.spinner.showSpinner(true);
    this.filter_expense_category = event.value
    await this.getExpensesByDistribution(this.expensesStorage.actualDistribution!);
    this.spinner.showSpinner(false);
  }
  
  async clearFilter() {
    this.spinner.showSpinner(true);
    this.filter_expense_category = undefined;
    await this.getExpensesByDistribution(this.expensesStorage.actualDistribution!)
    this.spinner.showSpinner(false);
  }
  
  openDialog(index: number, element: any) {
    switch (index) {
      case 1:
        this.presaleStorage.actualDistribution = this.expensesStorage.actualDistribution
        this.expensesStorage.isUpdateCreationExpense = false
        this.expensesStorage.actualExpense = null
        this.modalService.open(ExpenseComponent)
        break;
        case 2:
        this.presaleStorage.actualDistribution = this.expensesStorage.actualDistribution
        this.expensesStorage.actualExpense = element
        this.expensesStorage.isUpdateCreationExpense = true
        this.modalService.open(ExpenseComponent)
        break;
      case 3:
        this.expensesStorage.actualExpense = element
        this.modalService.open(DeleteConfirmExpenseComponent)
        break;
    }
  }

  changeRoute(event: any) {
    this.spinner.showSpinner(true);
    const distribution = this.distributions.find((r: Distribution) => r.route_id == event.value)!
    this.expensesStorage.actualDistribution = distribution
    this.getExpensesByDistribution(distribution);
    this.spinner.showSpinner(false);
  }

  async getExpensesByDistribution(distribution: Distribution) {
    if (!distribution) {
      this.dataSource.data = []
    } else {
      this.dataSource.data = await this.expensesService.getListExpenses({
        distribution_id: distribution.id,
        expense_category_id: this.filter_expense_category
      });
    }
  }

  formatDate(date: string) {
    return formatDate(date, 'DD [de] MMMM [de] YYYY')
  }
}
