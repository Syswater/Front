import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Moment } from 'moment';
import { Subscription, fromEvent, debounceTime } from 'rxjs';
import { AppStorage } from 'src/app/app.storage';
import { ReportStorage } from 'src/app/modules/reports/reports.storage';
import { ContainerReport } from 'src/data/models/container_report';
import { ExpenseReport } from 'src/data/models/expense_report';
import { Route } from 'src/data/models/route';
import { SaleReport } from 'src/data/models/sale_report';
import { DistributionService } from 'src/data/services/distribution.service';
import { RouteStorage } from '../../route.storage';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { SpinnerService } from 'src/data/services/spinner.service';
import { DistributionReport } from 'src/data/models/distribution_report';

@Component({
  selector: 'app-modal-report-distribution',
  templateUrl: './modal-report-distribution.component.html',
  styleUrls: ['./modal-report-distribution.component.css']
})
export class ModalReportDistributionComponent implements OnInit, AfterViewInit {
  @ViewChild('sales_desktop', { read: ElementRef, static: false }) sales_desktop!: ElementRef;
  @ViewChild('sales_mobile', { read: ElementRef, static: false }) sales_mobile!: ElementRef;
  @ViewChild('expenses_desktop', { read: ElementRef, static: false }) expenses_desktop!: ElementRef;
  @ViewChild('expenses_mobile', { read: ElementRef, static: false }) expenses_mobile!: ElementRef;
  @ViewChild('balance_desktop', { read: ElementRef, static: false }) balance_desktop!: ElementRef;
  @ViewChild('balance_mobile', { read: ElementRef, static: false }) balance_mobile!: ElementRef;
  @ViewChild('containers_desktop', { read: ElementRef, static: false }) containers_desktop!: ElementRef;
  @ViewChild('containers_mobile', { read: ElementRef, static: false }) containers_mobile!: ElementRef;
  @ViewChild('charge_desktop', { read: ElementRef, static: false }) charge_desktop!: ElementRef;
  @ViewChild('charge_mobile', { read: ElementRef, static: false }) charge_mobile!: ElementRef;

  resizeSubscription!: Subscription;

  viewSales: [number, number] = [400, 400];
  viewExpenses: [number, number] = [400, 400];
  viewCharge: [number, number] = [400, 400];
  viewBalance: [number, number] = [400, 400];
  viewContainers: [number, number] = [400, 400];

  routes: Route[] = [];
  reloadClients!: Subscription;
  dataSales: any = []
  quantitySold = 26;
  dataExpenses: any = [];
  dataBalance: any = [];
  dataCharge: any = [];
  containersCount: string = '21 / 24 / 11';
  dataContainers: any = [];
  totalContainers = 40;
  resizeTimer: any;

  initDate!: Moment;
  finalDate!: Moment;
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
  totalSales: number = 0;
  totalExpenses: number = 0;
  totalBalance: number = 0;

  formDates: FormGroup = this.fb.group({
    initDate: ['', Validators.required],
    finalDate: ['', Validators.required]
  })

  chargeTotal: string = '';
  totalCharged?: number = 0;

  constructor(
    public appStorage: AppStorage,
    public reportsStorage: ReportStorage,
    private distributionService: DistributionService,
    public routeStorage: RouteStorage,
    private fb: FormBuilder,
    private spinner: SpinnerService
  ) { }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  async ngOnInit() {
    this.spinner.showSpinner(true)
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.updateChartView();
        }, 10);
      });
    await this.getDataGraphics()
    this.spinner.showSpinner(false)
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateChartView();
    }, 500)
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

  async getDataGraphics() {
    try {
      const distributionReport = await this.distributionService.getDistributionReport({
        distribution_id: this.routeStorage.actualRoute!.distribution_id!
      })
      this.totalCharged = distributionReport.load ?? 0
      this.chargeTotal = `${distributionReport.load ?? 0} / ${distributionReport.saleReport.quantitySold ?? 0} / ${(distributionReport.load - distributionReport.saleReport.quantitySold) ?? 0}`
      await this.getSalesReport(distributionReport.saleReport);
      await this.getContainerReport(distributionReport.containerReport);
      await this.getExpensesReport(distributionReport.expenseReport);
      await this.getChargeReport(distributionReport);
    } catch (error) {
      showPopUp('Error al obtener el reporte de distribucion', 'error')
    }
  }

  getChargeReport(distributionReport: DistributionReport) {
    this.dataCharge = [
      {
        name: 'Cargue',
        value: distributionReport.load ?? 0,
      },
      {
        name: 'Vendido',
        value: distributionReport.saleReport.quantitySold ?? 0,
      }, 
      {
        name: 'Sobrante',
        value: (distributionReport.load - distributionReport.saleReport.quantitySold) ?? 0,
      },
    ]
  }


  async getSalesReport(saleReport: SaleReport) {
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

  async getContainerReport(containersReport: ContainerReport) {
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

  async getExpensesReport(expenseReport: ExpenseReport) {
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
  }

}
