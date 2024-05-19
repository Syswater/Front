import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { AppStorage } from 'src/app/app.storage';
import { Route } from 'src/data/models/route';
import { ReportStorage } from './reports.storage';
import { SpinnerService } from 'src/data/services/spinner.service';
import { RouteService } from 'src/data/services/route.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

const DATA_SALES_EXAMPLE = [
  {
    "name": "Efectivo",
    "series": [
      {
        "name": "Lunes",
        "value": 200000
      },
      {
        "name": "Martes",
        "value": 300000
      }
    ]
  },

  {
    "name": "Nequi",
    "series": [
      {
        "name": "Lunes",
        "value": 200000
      },
      {
        "name": "Martes",
        "value": 400000
      }
    ]
  },

  {
    "name": "Daviplata",
    "series": [
      {
        "name": "Lunes",
        "value": 200000
      },
      {
        "name": "Martes",
        "value": 350000
      }
    ]
  },
  {
    "name": "Bancolombia",
    "series": [
      {
        "name": "Lunes",
        "value": 100000
      },
      {
        "name": "Martes",
        "value": 200000
      }
    ]
  },
];

const DATA_EXPENSES_EXAMPLE = [
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  },
  {
    "name": "UK",
    "value": 6200000
  }
];

const DATA_BALANCE_EXAMPLE = [
  {
    "name": "Ventas",
    "value": 940000
  },
  {
    "name": "Gastos",
    "value": 500000
  }
];

const DATA_CONTAINERS_EXAMPLE = [
  {
    "name": "Prestados",
    "series": [
      {
        "name": "Etiquetado",
        "value": 3
      },
      {
        "name": "No etiquetado",
        "value": 13
      }
    ]
  },

  {
    "name": "Devueltos",
    "series": [
      {
        "name": "Etiquetado",
        "value": 10
      },
      {
        "name": "No etiquetado",
        "value": 6
      }
    ]
  },

  {
    "name": "Rotos",
    "series": [
      {
        "name": "Etiquetado",
        "value": 2
      },
      {
        "name": "No etiquetado",
        "value": 10
      }
    ]
  }
];

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sales_desktop', { read: ElementRef, static: false }) sales_desktop!: ElementRef;
  @ViewChild('sales_mobile', { read: ElementRef, static: false }) sales_mobile!: ElementRef;
  @ViewChild('expenses_desktop', { read: ElementRef, static: false }) expenses_desktop!: ElementRef;
  @ViewChild('expenses_mobile', { read: ElementRef, static: false }) expenses_mobile!: ElementRef;
  @ViewChild('balance_desktop', { read: ElementRef, static: false }) balance_desktop!: ElementRef;
  @ViewChild('balance_mobile', { read: ElementRef, static: false }) balance_mobile!: ElementRef;
  @ViewChild('containers_desktop', { read: ElementRef, static: false }) containers_desktop!: ElementRef;
  @ViewChild('containers_mobile', { read: ElementRef, static: false }) containers_mobile!: ElementRef;

  resizeSubscription!: Subscription;
  initChargeReports: boolean = false
  completeRequest: boolean = false

  viewSales: [number, number] = [400, 400];
  viewExpenses: [number, number] = [400, 400];
  viewBalance: [number, number] = [400, 400];
  viewContainers: [number, number] = [400, 400];

  routes: Route[] = [];
  reloadClients!: Subscription;
  totalSales: string = '$. 3.500.000 COP';
  dataSales = DATA_SALES_EXAMPLE
  quantitySold = 26;
  totalExpenses: string = '$. 2.500.000 COP';
  totalBalance: string = '$. 1.500.000 COP';
  dataExpenses = DATA_EXPENSES_EXAMPLE;
  dataBalance = DATA_BALANCE_EXAMPLE;
  containersCount: string = '21 / 24 / 11';
  dataContainers = DATA_CONTAINERS_EXAMPLE;
  totalContainers = 40;
  resizeTimer: any;

  constructor(
    public appStorage: AppStorage,
    public reportsStorage: ReportStorage,
    private spinner: SpinnerService,
    private routeService: RouteService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) { }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.reloadClients = this.reportsStorage
      .getObservable('reloadClients')
      .subscribe((v) => this.reload());
    this._locale = 'es';
    this._adapter.setLocale(this._locale);
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.updateChartView();
        }, 10);
      });
  }

  reload(): void {
    this.getRoutes()
  }

  async getRoutes() {
    this.spinner.showSpinner(true);
    this.routes = await this.routeService.getRoutes();
    this.spinner.showSpinner(false);
  }

  changeRoute($event: MatSelectChange) {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
    this.updateChartView();
  }

  updateChartView() {
    if (this.appStorage.isDesktop) {
      const height = 400;
      const widthSales = this.sales_desktop.nativeElement.offsetWidth + 20;
      const widthExpenses = this.expenses_desktop.nativeElement.offsetWidth - 150;
      const widthBalance = this.balance_desktop.nativeElement.offsetWidth - 20;
      const widthContainers = this.containers_desktop.nativeElement.offsetWidth - 20;
      this.viewSales = [widthSales, height];
      this.viewExpenses = [widthExpenses, height];
      this.viewBalance = [widthBalance, height];
      this.viewContainers = [widthContainers, height];
    } else if (!this.appStorage.isDesktop) {
      const height = 300;
      const widthSales = this.sales_mobile.nativeElement.offsetWidth + 20;
      const widthExpenses = this.expenses_mobile.nativeElement.offsetWidth - 20;
      const widthBalance = this.balance_mobile.nativeElement.offsetWidth - 20;
      const widthContainers = this.containers_mobile.nativeElement.offsetWidth - 20;
      this.viewSales = [widthSales, height];
      this.viewExpenses = [widthExpenses, height];
      this.viewBalance = [widthBalance, height];
      this.viewContainers = [widthContainers, height];
    }
  }

  consultReportsRange() {
    this.completeRequest = false
    this.initChargeReports = true;
    setTimeout(()=>{
      this.completeRequest = true;
      this.initChargeReports = false;
    }, 3000)
  }
}
