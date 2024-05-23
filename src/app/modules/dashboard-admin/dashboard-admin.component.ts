import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppStorage } from 'src/app/app.storage';
import { DashboardAdminStorage } from './dashboard-admin.storage';
import { MatSelectChange } from '@angular/material/select';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { ReportStorage } from '../reports/reports.storage';
import { getLastDateOf, getStartDayCurrent } from 'src/app/utils/DateUtils';
import { AuthService } from 'src/data/services/auth.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { RouteService } from 'src/data/services/route.service';
import { Route } from 'src/data/models/route';
import { Moment } from 'moment';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { ReportsService } from 'src/data/services/reports.service';
import { SaleReport } from 'src/data/models/sale_report';
import { ContainerReport } from 'src/data/models/container_report';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('sales_desktop', { read: ElementRef, static: false })
  sales_desktop!: ElementRef;
  @ViewChild('sales_mobile', { read: ElementRef, static: false })
  sales_mobile!: ElementRef;
  @ViewChild('expenses_desktop', { read: ElementRef, static: false })
  expenses_desktop!: ElementRef;
  @ViewChild('expenses_mobile', { read: ElementRef, static: false })
  expenses_mobile!: ElementRef;
  @ViewChild('balance_desktop', { read: ElementRef, static: false })
  balance_desktop!: ElementRef;
  @ViewChild('balance_mobile', { read: ElementRef, static: false })
  balance_mobile!: ElementRef;
  @ViewChild('containers_desktop', { read: ElementRef, static: false })
  containers_desktop!: ElementRef;
  @ViewChild('containers_mobile', { read: ElementRef, static: false })
  containers_mobile!: ElementRef;

  resizeSubscription!: Subscription;
  initChargeReports: boolean = false;
  completeRequest: boolean = false;

  viewSales: [number, number] = [400, 400];
  viewExpenses: [number, number] = [400, 400];
  viewBalance: [number, number] = [400, 400];
  viewContainers: [number, number] = [400, 400];

  routes: Route[] = [];
  reloadClients!: Subscription;
  dataSales: any = [];
  dataExpenses: any = [];
  dataBalance: any = [];
  containersCount: string = '21 / 24 / 11';
  dataContainers: any = [];
  totalContainers = 40;
  resizeTimer: any;
  initDate!: Moment;
  currentDate!: Moment;
  totalSalesEfectivo: number = 0;
  totalSalesNequi: number = 0;
  totalSalesDaviplata: number = 0;
  totalSalesBancolombia: number = 0;
  totalExpensesAlim: number = 0;
  totalExpensesPeaj: number = 0;
  totalExpensesTrans: number = 0;
  totalExpensesOthers: number = 0;
  totalContainersBorrowed: number = 0;
  totalContainersReturned: number = 0;
  totalContainersBroken: number = 0;
  quantitySold = 0;
  totalSales: number = 0;
  totalExpenses: number = 0;
  totalBalance: number = 0;

  constructor(
    public reportsStorage: ReportStorage,
    public appStorage: AppStorage,
    public dashboardStorage: DashboardAdminStorage,
    private authService: AuthService,
    private spinner: SpinnerService,
    private routeService: RouteService,
    private reportService: ReportsService
  ) {}

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.initDate = getLastDateOf(7, 'days');
    this.currentDate = getStartDayCurrent();
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.updateChartView();
        }, 10);
      });

    this.authService.isLoginView = false;
    this.spinner.showSpinner(true);
    await this.getRoutes();
    await this.updateRoute(
      JSON.parse(`${localStorage.getItem('dashboard-admin-actualRoute')}`)
    );
    await this.getDataGraphics();
    this.spinner.showSpinner(false);
  }

  async getDataGraphics() {
    await this.getSalesReport();
    await this.getContainerReport();
    await this.getExpensesReport();
  }

  async getSalesReport() {
    try {
      const saleReport: SaleReport = await this.reportService.getSalesReport({
        route_id: this.dashboardStorage.actualRoute!.id,
        initDate: this.initDate.format('YYYY-MM-DD'),
        finalDate: this.currentDate.format('YYYY-MM-DD'),
      });

      const seriesEfectivo = this.getSeriesSalesOf(saleReport, 'EFECTIVO');
      const seriesNequi = this.getSeriesSalesOf(saleReport, 'NEQUI');
      const seriesDaviplata = this.getSeriesSalesOf(saleReport, 'DAVIPLATA');
      const seriesBancolombia = this.getSeriesSalesOf(
        saleReport,
        'BANCOLOMBIA'
      );

      this.totalSales = saleReport.total;
      this.quantitySold = saleReport.quantitySold;

      this.dataSales = [
        {
          name: 'Efectivo',
          series: seriesEfectivo,
        },
        {
          name: 'Nequi',
          series: seriesNequi,
        },
        {
          name: 'Daviplata',
          series: seriesDaviplata,
        },
        {
          name: 'Bancolombia',
          series: seriesBancolombia,
        },
      ];
    } catch (error) {
      showPopUp('Error al obtener los datos del reporte de Ventas', 'error');
    }
  }
  getSeriesSalesOf(saleReport: any, type: string) {
    return saleReport.per_method
      .filter((m: any) => m.method == type)
      .map((obj: any) => {
        if (type == 'EFECTIVO') this.totalSalesEfectivo += obj.value;
        if (type == 'NEQUI') this.totalSalesNequi += obj.value;
        if (type == 'DAVIPLATA') this.totalSalesDaviplata += obj.value;
        if (type == 'BANCOLOMBIA') this.totalSalesBancolombia += obj.value;
        return { name: obj.date, value: obj.value };
      });
  }

  async getContainerReport() {
    try {
      const containersReport: ContainerReport =
        await this.reportService.getContainersReport({
          route_id: this.dashboardStorage.actualRoute!.id,
          initDate: this.initDate.format('YYYY-MM-DD'),
          finalDate: this.currentDate.format('YYYY-MM-DD'),
        });
      this.containersCount = `${containersReport.total_borrowed} / ${containersReport.total_returned} / ${containersReport.total_broken}`;
      this.totalContainersBorrowed = containersReport.total_borrowed;
      this.totalContainersReturned = containersReport.total_returned;
      this.totalContainersBroken = containersReport.total_broken;

      this.dataContainers = [
        {
          name: 'Prestados',
          series: this.getSeriesContainersOf(containersReport, 'BORROWED'),
        },
        {
          name: 'Devueltos',
          series: this.getSeriesContainersOf(containersReport, 'RETURNED'),
        },
        {
          name: 'Rotos',
          series: this.getSeriesContainersOf(containersReport, 'BROKEN'),
        },
      ];

    } catch (error) {
      showPopUp('Error al obtener los datos del reporte de Envases', 'error');
    }
  }

  getSeriesContainersOf(containerReport: ContainerReport, type: string) {
    return containerReport.per_type
      .filter((m) => m.type == type)
      .map((obj) => {
        const valueEtiq =
          obj.product_name == 'Botellón 20 LTS Etiquetado' ? obj.value : 0;
        const valueNoEtiq =
          obj.product_name == 'Botellón 20 LTS SIN Etiquetar' ? obj.value : 0;
        return [
          { name: 'Botellón 20 LTS Etiquetado', value: valueEtiq },
          { name: 'Botellón 20 LTS SIN Etiquetar', value: valueNoEtiq }
        ];
      })
      .flat();
  }

  async getExpensesReport() {
    try {
      const expenseReport = await this.reportService.getExpensesReport({
        route_id: this.dashboardStorage.actualRoute!.id,
        initDate: this.initDate.format('YYYY-MM-DD'),
        finalDate: this.currentDate.format('YYYY-MM-DD'),
      });
      this.dataExpenses = expenseReport.per_category.map((cat) => {
        switch (cat.category.type) {
          case 'Peajes':
            this.totalExpensesPeaj = cat.value;
            break;
          case 'Transporte':
            this.totalExpensesTrans = cat.value;
            break;
          case 'Alimentación':
            this.totalExpensesAlim = cat.value;
            break;
          case '--Otros--':
            this.totalExpensesOthers = cat.value;
            break;
        }
        return {
          name: cat.category.type,
          value: cat.value,
        };
      });
      this.totalExpenses = expenseReport.total;
      this.dataBalance = [
        {
          name: 'Ventas',
          value: this.totalSales,
        },
        {
          name: 'Gastos',
          value: this.totalExpenses,
        },
      ];
      this.totalBalance = this.totalSales - this.totalExpenses;
    } catch (error) {
      showPopUp('Error al obtener los datos del reporte de Gastos', 'error');
    }
  }

  async updateRoute(route: Route | undefined | null) {
    this.dashboardStorage.actualRoute = route;
  }

  async getRoutes() {
    this.routes = await this.routeService.getRoutes();
    if (!localStorage.getItem('dashboard-admin-actualRoute')) {
      localStorage.setItem(
        'dashboard-admin-actualRoute',
        JSON.stringify(this.routes.length ? this.routes[0] : null)
      );
      this.dashboardStorage.actualRoute = this.routes.length
        ? this.routes[0]
        : null;
    } else {
      this.dashboardStorage.actualRoute = JSON.parse(
        `${localStorage.getItem('dashboard-admin-actualRoute')}`
      ) as Route;
    }
  }

  ngAfterViewInit() {
    this.updateChartView();
  }

  updateChartView() {
    if (this.appStorage.isDesktop) {
      const height = 400;
      const widthSales = this.sales_desktop.nativeElement.offsetWidth + 20;
      const widthExpenses =
        this.expenses_desktop.nativeElement.offsetWidth - 150;
      const widthBalance = this.balance_desktop.nativeElement.offsetWidth - 20;
      const widthContainers =
        this.containers_desktop.nativeElement.offsetWidth - 20;
      this.viewSales = [widthSales, height];
      this.viewExpenses = [widthExpenses, height];
      this.viewBalance = [widthBalance, height];
      this.viewContainers = [widthContainers, height];
    } else if (!this.appStorage.isDesktop) {
      const height = 300;
      const widthSales = this.sales_mobile.nativeElement.offsetWidth + 20;
      const widthExpenses = this.expenses_mobile.nativeElement.offsetWidth - 20;
      const widthBalance = this.balance_mobile.nativeElement.offsetWidth - 20;
      const widthContainers =
        this.containers_mobile.nativeElement.offsetWidth - 20;
      this.viewSales = [widthSales, height];
      this.viewExpenses = [widthExpenses, height];
      this.viewBalance = [widthBalance, height];
      this.viewContainers = [widthContainers, height];
    }
  }

  getRangeDate() {
    return `${this.initDate.format('DD/MM/YYYY')} - ${this.currentDate.format(
      'DD/MM/YYYY'
    )}`;
  }

  async changeRoute(event: any) {
    this.spinner.showSpinner(true)
    this.resetVariables();
    const route = this.routes.find((r) => r.id == event.value)
    localStorage.setItem('dashboard-admin-actualRoute', JSON.stringify(route))
    await this.updateRoute(
      JSON.parse(`${localStorage.getItem('dashboard-admin-actualRoute')}`)
    );
    await this.getDataGraphics();
    this.spinner.showSpinner(false)
  }

  resetVariables() {
    this.totalSalesEfectivo = 0;
    this.totalSalesNequi = 0;
    this.totalSalesDaviplata = 0;
    this.totalSalesBancolombia = 0;
    this.totalExpensesAlim = 0;
    this.totalExpensesPeaj = 0;
    this.totalExpensesTrans = 0;
    this.totalExpensesOthers = 0;
    this.totalContainersBorrowed = 0;
    this.totalContainersReturned = 0;
    this.totalContainersBroken = 0;
    this.quantitySold = 0;
    this.totalSales = 0;
    this.totalExpenses = 0;
    this.totalBalance = 0;
  }
}
