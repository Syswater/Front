import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../../data/services/route.service';
import { Route } from '../../../data/models/route';
import { SpinnerService } from 'src/data/services/spinner.service';
import { ModalService } from '../../../data/services/modal.service';
import { RouteFormComponent } from './components/route-form/route-form.component';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit {

  routes: Route[] = [];
  weekdays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(private routeService: RouteService, private spinnerService: SpinnerService, private modalService: ModalService) { }

  async ngOnInit() {
    await this.loadRoutes();
  }

  async loadRoutes() {
    this.spinnerService.showSpinner(true);
    this.routes = await this.routeService.getRoutes({ whit_status: "true" });
    this.spinnerService.showSpinner(false);
  }

  isDayInRoute(route: Route, weekday: string) {
    return route.weekdays.includes(weekday);
  }

  showDialogRoute(element: any, flag: number) {
    switch (flag) {
      case 1:
        this.modalService.open(RouteFormComponent, () => { });
        break;
      case 2:
        this.modalService.open(RouteFormComponent, () => { });
        break;
    }
  }
}
