import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../../data/services/route.service';
import { DayOfWeek, Route } from '../../../data/models/route';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit {


  routes: Route[] = [];
  weekdays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  rowData: Route[] = [];

  constructor(private routeService: RouteService) { }


  ngOnInit(): void {
    (async () => {
      this.routes = await this.routeService.getRoutes()
    })();
  }

  getBooleanDay(route: Route, weekday: string) {
    return route.weekdays.find(day => day == weekday)
  }

}
