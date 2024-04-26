import { Component, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { AuthService } from 'src/data/services/auth.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { DashboardStorage } from './dashboard.storage';
import { Route } from 'src/data/models/route';
import { RouteService } from 'src/data/services/route.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  single: any[] = [
    {
      "name": "Normal",
      "value": 1000
    },
    {
      "name": "Servifacil",
      "value": 500
    },
  ];
  view: [number, number] = [700, 200];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Population';
  colorScheme: Color = {
    domain: ['#6FDB90', '#6E96DB'],
    group: ScaleType.Ordinal,
    name: 'SysWaterColors',
    selectable: true
  };
  
  
  ////////////
  
  singlePie: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    }
  ];
  viewPie: [number, number] = [273, 200];
  
  // options
  showLabels: boolean = false;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;
  
  colorSchemePie: Color = {
    domain: ['#6EB8DB', '#6EDAB6'],
    group: ScaleType.Ordinal,
    name: 'SysWaterColors',
    selectable: true
  };

  routes: Route[] = []

  constructor(private routesService: RouteService, private authService: AuthService, private spinner: SpinnerService, public dashboardStorage: DashboardStorage){}
  
  async ngOnInit() {
    this.authService.isLoginView = false
    await this.getRoutes();
    await this.getClientsByRoute(this.dashboardStorage.actualRoute);
  }
  
  async getClientsByRoute(route: Route | undefined | null) {
    this.spinner.showSpinner(true);
    this.dashboardStorage.actualRoute = route
    this.spinner.showSpinner(false);
  }

  async getRoutes() {
    this.spinner.showSpinner(true);
    this.routes = await this.routesService.getRoutes({
      status: 'PREORDER',
    });
    this.dashboardStorage.actualRoute = this.routes[0];
    this.spinner.showSpinner(false);
  }

  changeRoute(event: any) {
    this.getClientsByRoute(this.routes.find((r) => r.id == event.value));
  }

}
