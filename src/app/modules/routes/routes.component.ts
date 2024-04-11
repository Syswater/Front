import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../../data/services/route.service';
import { Route } from '../../../data/models/route';
import { SpinnerService } from 'src/data/services/spinner.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit {

  routes: Route[] = [];
  weekdays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(private routeService: RouteService, private spinnerService: SpinnerService) { }

  async ngOnInit() {
    this.spinnerService.showSpinner(true);
    this.routes = await this.routeService.getRoutes({ whit_status: "true" });
    this.spinnerService.showSpinner(false);
  }

  isDayInRoute(route: Route, weekday: string) {
    return route.weekdays.includes(weekday);
  }
}
