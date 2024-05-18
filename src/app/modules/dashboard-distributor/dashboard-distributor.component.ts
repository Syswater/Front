import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/data/services/auth.service';
import { ClientService } from 'src/data/services/client.service';
import { DistributionService } from 'src/data/services/distribution.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { MatTableDataSource } from '@angular/material/table';
import { Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { AppStorage } from 'src/app/app.storage';
import { getCurrentDate } from 'src/app/utils/DateUtils';
import { Distribution } from 'src/data/models/distribution';
import { Route } from 'src/data/models/route';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { DashboardDistributorStorage } from './dashboard-distributor.storage';
import { ExpensesService } from 'src/data/services/expenses.service';

@Component({
  selector: 'app-dashboard-distributor',
  templateUrl: './dashboard-distributor.component.html',
  styleUrls: ['./dashboard-distributor.component.css'],
})
export class DashboardDistributorComponent implements OnInit {
  single: any[] = [];
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

  singlePie: any[] = [];
  viewPie: [number, number] = [200, 200];

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
  dataSourceSales = new MatTableDataSource<any>([]);
  displayedColumnsPresales: string[] = [
    'Orden',
    'Cliente',
    'Cantidad',
    'Observaciones',
  ];

  dataSourceClients = new MatTableDataSource<any>([]);
  displayedColumnsClients: string[] = [
    'Nombres',
    'Dirección',
    'Barrio',
    'Contacto',
    'Deuda',
  ];
  expensesDt: any[] = []

  constructor(
    private authService: AuthService,
    private spinner: SpinnerService,
    public dashboardStorage: DashboardDistributorStorage,
    private clientService: ClientService,
    private distributionService: DistributionService,
    public appStorage: AppStorage,
    private expenseService: ExpensesService
  ) { }

  async ngOnInit() {
    this.authService.isLoginView = false;
    this.spinner.showSpinner(true);
    await this.getRoutesDistributor();
    if (!localStorage.getItem('dashboard-dist-actualRoute')) localStorage.setItem('dashboard-dist-actualRoute', JSON.stringify(this.distributionRoutes.length ? this.distributionRoutes[0].route : null))
    if (!localStorage.getItem('dashboard-dist-actualDistribution')) localStorage.setItem('dashboard-dist-actualDistribution', JSON.stringify(this.distributionRoutes.length ? this.distributionRoutes[0] : []))
    this.dashboardStorage.actualDistribution = this.distributionRoutes[0]
    await this.updateRoute(JSON.parse(`${localStorage.getItem('dashboard-dist-actualRoute')}`));
    await this.getDashboardClientsInfo();
    await this.getClientsByRoute(
      JSON.parse(`${localStorage.getItem('dashboard-dist-actualRoute')}`)
    );
    await this.getExpensesDistribution()
    this.updateGraphics();
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
    ];
    this.singlePie = [
      {
        name: 'Atendidos',
        value: this.getTotalClientsAnswered().totalAnswered,
      },
      {
        name: 'No Atendidos',
        value: this.getTotalClientsAnswered().totalNoAnswered,
      },
    ];
  }

  getTotalSelledProductsByType() {
    let orderServifacil = 0,
      orderNormal = 0;
    for (const client of this.dataSourceSales.data) {
      if (client.sale) {
        if (client.tape_preference == 'SERVIFACIL')
          orderServifacil += client.sale.amount;
        if (client.tape_preference == 'NORMAL')
          orderNormal += client.sale.amount;
      }
    }
    return { orderNormal, orderServifacil };
  }

  async getDistributions() {
    this.distributionRoutes = await this.distributionService.getDistributions({
      status: 'PREORDER',
      with_route: true,
    });
    this.dashboardStorage.actualDistribution = this.distributionRoutes[0];
  }

  async getClientsByRoute(route: Route | undefined | null) {
    try {
      if(route){
        this.dataSourceSales.data = (
          await this.clientService.getListClients({
            route_id: route!.id,
            distribution_id: JSON.parse(`${localStorage.getItem('dashboard-dist-actualDistribution')}`).id,
            with_notes: true,
            with_sale: true,
          })
        ).map((d) => ({ ...d, quantity: '-' }));
      }else{
        this.dataSourceSales.data = []
      }
    } catch (error) {
      showPopUp('Error al obtener los clientes', 'error');
      this.spinner.showSpinner(false);
    }
  }

  async getDashboardClientsInfo() {
    if(this.dashboardStorage.actualDistribution){
      this.dataSourceClients.data = await this.clientService.getListClients({
        route_id: this.dashboardStorage.actualDistribution!.route_id,
        distribution_id: this.dashboardStorage.actualDistribution!.id,
        with_notes: true,
        with_order: true,
        with_sale: true
      });
    }else{
      this.dataSourceClients.data = []
    }
  }

  async updateRoute(route: Route | undefined | null) {
    this.dashboardStorage.actualRoute = route;
  }

  async getRoutesDistributor() {
    this.distributionRoutes = await this.distributionService.getDistributions({
      status: 'OPENED',
      with_route: true,
      distributor_id: this.appStorage.user.id
    });
    this.dashboardStorage.actualDistribution = this.distributionRoutes[0];
  }

  async changeRoute(event: any) {
    this.spinner.showSpinner(true);
    const distribution = this.distributionRoutes.find((r) => r.route_id == event.value);
    localStorage.setItem('dashboard-dist-actualRoute', JSON.stringify(distribution?.route))
    localStorage.setItem('dashboard-dist-actualDistribution', JSON.stringify(distribution))
    this.dashboardStorage.actualDistribution = distribution
    this.dashboardStorage.actualRoute = distribution?.route
    this.updateRoute(distribution?.route);
    await this.getClientsByRoute(this.dashboardStorage.actualRoute);
    this.updateGraphics();
    this.getExpensesDistribution()
    this.dataSourceSales.data = [...this.dataSourceSales.data];
    this.spinner.showSpinner(false);
  }

  getTotalProductsSelled() {
    let total = 0;
    for (const client of this.dataSourceSales.data) {
      total += client.sale
        ? client.sale.amount
        : 0;
    }
    return total;
  }

  getTotalClientsAnswered() {
    let totalAnswered = 0;
    let totalNoAnswered = 0;
    for (const client of this.dataSourceSales.data) {
      if (client.is_served) {
        totalAnswered += 1;
      } else {
        totalNoAnswered += 1;
      }
    }
    return { totalAnswered, totalNoAnswered };
  }

  getTotalDebtAndEnvases() {
    let totalDebt = 0,
      totalEnvases = 0;
    for (const client of this.dataSourceSales.data) {
      totalDebt += client.totalDebt ?? 0;
      totalEnvases += client.borrowedContainers ?? 0;
    }
    return { totalDebt, totalEnvases };
  }

  getDate() {
    return getCurrentDate('DD [de] MMMM [de] YYYY');
  }

  getTotalPaid(): number {
    let totalPaid = 0
    for (const customer of this.dataSourceSales.data) {
      if (customer.sale) {
        totalPaid += customer.sale.value_paid
      }
    }
    return totalPaid
  }

  async getExpensesDistribution() {
    try {
      if(this.dashboardStorage.actualDistribution){
        this.expensesDt = await this.expenseService.getListExpenses({
          distribution_id: this.dashboardStorage.actualDistribution!.id
        })
      }
    } catch (error) {
      showPopUp('Error al obtener los gastos de la distribucion', 'error')
    }
  }

  getTotalExpenses() {
    let totalExpense = 0
    for (const expense of this.expensesDt) {
      totalExpense += expense.value
    }
    return totalExpense
  }
}
