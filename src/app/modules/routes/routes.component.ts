import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../../data/services/route.service';
import { Route } from '../../../data/models/route';
import { SpinnerService } from 'src/data/services/spinner.service';
import { ModalService } from '../../../data/services/modal.service';
import { RouteFormComponent } from './components/route-form/route-form.component';
import { RouteStorage } from './route.storage';
import { DeleteRouteModalComponent } from './components/delete-route-modal/delete-route-modal.component';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit {

  routes: Route[] = [];
  weekdays: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  filter?: string;

  constructor(
    private routeService: RouteService,
    private spinnerService: SpinnerService,
    private routeStorage: RouteStorage,
    private modalService: ModalService) { }

  async ngOnInit() {
    await this.loadRoutes();
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
}
