import { Component, OnInit } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { AuthService } from 'src/data/services/auth.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { DashboardStorage } from './dashboard.storage';
import { Route } from 'src/data/models/route';
import { RouteService } from 'src/data/services/route.service';
import { ClientService } from 'src/data/services/client.service';
import { DistributionService } from 'src/data/services/distribution.service';
import { MatTableDataSource } from '@angular/material/table';
import { Distribution } from 'src/data/models/distribution';
import { getCurrentDate } from 'src/app/utils/DateUtils';
import { AppStorage } from 'src/app/app.storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  single: any[] = [
    {
      name: 'Normal',
      value: 1000,
    },
    {
      name: 'Servifacil',
      value: 500,
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
    selectable: true,
  };

  ////////////

  singlePie: any[] = [
    {
      name: 'Germany',
      value: 8940000,
    },
    {
      name: 'USA',
      value: 5000000,
    },
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
    selectable: true,
  };

  distributionRoutes: Distribution[] = [];
  dataSourcePresales = new MatTableDataSource<any>([]);
  displayedColumnsPresales: string[] = ['Orden', 'Cliente', 'Cantidad', 'Observaciones']

  dataSourceClients = new MatTableDataSource<any>([]);
  displayedColumnsClients: string[] = ['Nombres', 'Dirección', 'Barrio', 'Contacto', 'Deuda']

  constructor(
    private routesService: RouteService,
    private authService: AuthService,
    private spinner: SpinnerService,
    public dashboardStorage: DashboardStorage,
    private clientService: ClientService,
    private distributionService: DistributionService,
    public appStorage: AppStorage
  ) { }

  async ngOnInit() {
    this.authService.isLoginView = false;
    this.spinner.showSpinner(true);
    await this.getRoutes();
    if (!localStorage.getItem('dashboard-pre-actualDistribution')) localStorage.setItem('dashboard-pre-actualDistribution', JSON.stringify(this.distributionRoutes[0]))
    if (!localStorage.getItem('dashboard-pre-actualRoute')) localStorage.setItem('dashboard-pre-actualRoute', JSON.stringify(this.distributionRoutes[0].route))
    await this.updateRoute(JSON.parse(`${localStorage.getItem('dashboard-pre-actualRoute')}`));
    await this.getDashboardClientsInfo();
    await this.getDistributions();
    await this.getClientsByRoute(JSON.parse(`${localStorage.getItem('dashboard-pre-actualRoute')}`));
    this.updateGraphics()
    this.spinner.showSpinner(false);
  }

  updateGraphics() {
    let { orderNormal, orderServifacil } = this.getTotalSelledProductsByType();
    this.single = [
      {
        name: 'Normal',
        value: orderNormal,
      },
      {
        name: 'Servifacil',
        value: orderServifacil,
      },
    ]
    this.singlePie = [
      {
        name: 'Contestaron',
        value: this.getTotalClientsAnswered().totalAnswered,
      },
      {
        name: 'No Contestaron',
        value: this.getTotalClientsAnswered().totalNoAnswered,
      },
    ];
  }

  getTotalSelledProductsByType() {
    let orderServifacil = 0, orderNormal = 0;
    for (const client of this.dataSourcePresales.data) {
      if (client.order) {
        if (client.order.tape_type == 'SERVIFACIL') orderServifacil += client.order.amount;
        if (client.order.tape_type == 'NORMAL') orderNormal += client.order.amount;
      }
    }
    return { orderNormal, orderServifacil };
  }

  async getDistributions() {
    this.distributionRoutes = await this.distributionService.getDistributions({ status: 'PREORDER', with_route: true })
    this.dashboardStorage.actualDistribution = this.distributionRoutes[0]
  }

  async getClientsByRoute(route: Route | undefined | null) {
    this.dataSourcePresales.data = (await this.clientService.getListClients({
      route_id: route!.id,
      distribution_id: this.dashboardStorage.actualDistribution?.id,
      with_notes: true,
      with_order: true
    })).map(d => ({ ...d, quantity: '-' }));
  }

  async getDashboardClientsInfo() {
    this.dataSourceClients.data = await this.clientService.getListClients({});
  }

  async updateRoute(route: Route | undefined | null) {
    this.dashboardStorage.actualRoute = route;
  }

  async getRoutes() {
    this.distributionRoutes = await this.distributionService.getDistributions({ status: 'PREORDER', with_route: true })
  }

  async changeRoute(event: any) {
    this.spinner.showSpinner(true);
    const route = this.distributionRoutes.find((r) => r.route_id == event.value)?.route
    localStorage.setItem('dashboard-pre-actualRoute', JSON.stringify(route))
    this.updateRoute(route);
    await this.getClientsByRoute(this.dashboardStorage.actualRoute);
    this.updateGraphics()
    this.dataSourcePresales.data = [...this.dataSourcePresales.data]
    this.spinner.showSpinner(false);
  }

  getTotalProductsSelled() {
    let total = 0
    for (const client of this.dataSourcePresales.data) {
      total += client.order ? client.order.amount : client.quantity != '-' ? client.quantity : 0
    }
    return total
  }

  getTotalClientsAnswered() {
    let totalAnswered = 0
    let totalNoAnswered = 0
    for (const client of this.dataSourcePresales.data) {
      if (client.order) {
        totalAnswered += 1
      } else {
        totalNoAnswered += 1
      }
    }
    return { totalAnswered, totalNoAnswered }
  }

  getTotalDebtAndEnvases() {
    let totalDebt = 0, totalEnvases = 0
    for (const client of this.dataSourcePresales.data) {
      totalDebt += client.totalDebt ?? 0
      totalEnvases += client.borrowedContainers ?? 0
    }
    return { totalDebt, totalEnvases}
  }

  getDate() {
    return getCurrentDate('DD [de] MMMM [de] YYYY');
  }

}