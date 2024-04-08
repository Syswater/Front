import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../../data/services/route.service';
import { DayOfWeek, Route } from '../../../data/models/route';
import { SpinnerService } from 'src/data/services/spinner.service';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit {


  routes: Route[] = [];
  weekdays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  rowData: Route[] = [];

  constructor(private routeService: RouteService, private spinnerService: SpinnerService) { }


  ngOnInit(): void {
    (async () => {
      this.spinnerService.showSpinner(true)
      this.routes = await this.routeService.getRoutes()
      this.spinnerService.showSpinner(false)
    })();
  }

  getBooleanDay(route: Route, weekday: string) {
    return route.weekdays.find(day => day == weekday)
  }

}
