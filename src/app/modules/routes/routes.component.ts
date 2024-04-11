import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../../data/services/route.service';
import { Route } from '../../../data/models/route';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit {


  routes: Route[] = [];
  weekdays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(private routeService: RouteService) { }


  ngOnInit(): void {
    (async () => {
      this.routes = await this.routeService.getRoutes({ whit_status: "true" });
    })();
  }

  getBooleanDay(route: Route, weekday: string) {
    return route.weekdays.find(day => day == weekday);
  }

}
