import { Component, Inject, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { AppStorage } from 'src/app/app.storage';
import { Route } from 'src/data/models/route';
import { ReportStorage } from './reports.storage';
import { SpinnerService } from 'src/data/services/spinner.service';
import { RouteService } from 'src/data/services/route.service';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

const DATA_EXAMPLE = [
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
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  routes: Route[] = [];
  reloadClients!: Subscription;
  totalSales: string = '$. 3.500.000 COP';
  data = DATA_EXAMPLE
  

  constructor(
    public appStorage: AppStorage,
    public reportsStorage: ReportStorage,
    private spinner: SpinnerService,
    private routeService: RouteService,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) { }

  ngOnInit(): void {
    this.reloadClients = this.reportsStorage
      .getObservable('reloadClients')
      .subscribe((v) => this.reload());
    this._locale = 'es';
    this._adapter.setLocale(this._locale);
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
}
