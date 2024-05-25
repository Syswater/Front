import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouteService } from '../../../data/services/route.service';
import { Route, RouteStatus } from '../../../data/models/route';
import { SpinnerService } from 'src/data/services/spinner.service';
import { ModalService } from '../../../data/services/modal.service';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { RouteStorage } from './route.storage';
import { DeleteRouteModalComponent } from './components/delete-route-modal/delete-route-modal.component';
import { DistributionService } from 'src/data/services/distribution.service';
import { getCurrentDate } from 'src/app/utils/DateUtils';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { Router } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AppStorage } from 'src/app/app.storage';
import { ConfirmRejectDistributionComponent } from './components/confirm-reject-distribution/confirm-reject-distribution.component';
import { ConfirmAcceptDistributionComponent } from './components/confirm-accept-distribution/confirm-accept-distribution.component';
import { InitDistributionFormComponent } from './components/init-distribution-form/init-distribution-form.component';
import { Subscription } from 'rxjs';
import { ModalReportDistributionComponent } from './components/modal-report-distribution/modal-report-distribution.component';
@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit, OnDestroy {
  routes: Route[] = [];
  weekdays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  filter?: string;
  formDate = this.fb.group({
    date: ['', Validators.required]
  })
  minDate: Date = moment().add(1, 'day').toDate();
  roleActual = ''
  $routesReload!: Subscription

  constructor(
    public appStorage: AppStorage,
    private routeService: RouteService,
    private spinnerService: SpinnerService,
    private routeStorage: RouteStorage,
    private modalService: ModalService,
    private distributionService: DistributionService,
    private router: Router,
    private fb: FormBuilder,
    private _adapter: DateAdapter<any>,
    @Inject(MAT_DATE_LOCALE) private _locale: string,
  ) { }

  ngOnDestroy(): void {
    this.$routesReload.unsubscribe()
  }

  async ngOnInit() {
    this.roleActual = `${localStorage.getItem('roleActual')}`
    this.$routesReload = this.routeStorage.getObservable('reloadRoutes').subscribe(() => this.loadRoutes());
    this._locale = 'es';
    this._adapter.setLocale(this._locale);
  }

  async loadRoutes() {
    this.spinnerService.showSpinner(true);
    this.routes = await this.routeService.getRoutes({ whit_status: "true", filter: this.filter });
    this.spinnerService.showSpinner(false);
  }

  isDayInRoute(route: Route, weekday: string) {
    return route.weekdays.includes(weekday);
  }

  showDialogRoute(element: any, flag: number) {
    this.routeStorage.actualRoute = element;

    switch (flag) {
      case 1:
        this.modalService.open(RouteFormComponent, () => { this.loadRoutes().then() });
        break;
      case 2:
        this.modalService.open(DeleteRouteModalComponent, () => { this.loadRoutes().then() });
        break;
    }
  }

  async filterClients(textOrEvent: string | KeyboardEvent) {
    console.log(typeof textOrEvent)
    if (textOrEvent instanceof KeyboardEvent) {
      const event = textOrEvent as KeyboardEvent;
      const keyPressed = event.key; // La tecla presionada.
      const inputText = (event.target as HTMLInputElement).value;
      if (keyPressed == 'Enter') {
        this.filter = inputText
        await this.loadRoutes();
      }
    } else {
      console.log('entro')
      this.filter = `${textOrEvent}`
      await this.loadRoutes();
    }
  }

  async clearFilter(input: HTMLInputElement) {
    this.filter = undefined
    await this.loadRoutes();
    input.value = ''
  }

  async managementRoute(route: Route, flag: boolean) {
    if (route.status?.toString() == 'WHITOUT' || route.status?.toString() == 'CLOSED' && flag) {
      try {
        this.spinnerService.showSpinner(true)
        await this.distributionService.createDistribution({ date: getCurrentDate(), route_id: route.id });
        showPopUp('Distribución creada con exito', 'success');
        if(this.roleActual == 'Administrador'){
          this.router.navigate(['/admin/dashboard']);
        }else{
          this.router.navigate(['/preseller/presales']);
        }
      } catch (error) {
        showPopUp('Error al crear la distribución', 'error');
      }
      this.spinnerService.showSpinner(false)
      return
    }
    switch (route.status?.toString()) {
      case 'PREORDER':
        this.router.navigate(['/preseller/presales'])
        break;
      case 'OPENED':
      case 'CLOSE_REQUEST':
        this.router.navigate(['/distributor/distribution'])
        break;
      case 'CLOSED':
        this.routeStorage.actualRoute = route
        this.appStorage.fromDistributionReport = true
        this.router.navigate(['admin/distribution-report'])
    }
  }

  initDistributionAdmin(route: Route) {
    this.routeStorage.actualRoute = route
    this.modalService.open(InitDistributionFormComponent)
  }

  rejectClosed(route: Route) {
    this.routeStorage.actualRoute = route
    this.modalService.open(ConfirmRejectDistributionComponent)
  }

  acceptClosed(route: Route) {
    this.routeStorage.actualRoute = route
    this.modalService.open(ConfirmAcceptDistributionComponent)
  }
}
