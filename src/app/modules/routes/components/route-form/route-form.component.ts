import { Component } from '@angular/core';
import { ModalService } from '../../../../../data/services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RouteService } from '../../../../../data/services/route.service';
import { SpinnerService } from '../../../../../data/services/spinner.service';
import { showPopUp } from '../../../../utils/SwalPopUp';
import { RouteStorage } from '../../route.storage';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.css']
})
export class RouteFormComponent {

  route = this.routeStorage.actualRoute;

  fields = {
    name: [this.route?.name ?? '', Validators.required],
    location: [this.route?.location ?? '', Validators.required],
    price: [this.route?.price ?? 0, [Validators.required, Validators.min(1000)]],
    monday: [this.route?.weekdays.find(day => day === "Lunes")],
    tuesday: [this.route?.weekdays.find(day => day === "Martes")],
    wednesday: [this.route?.weekdays.find(day => day === "Miércoles")],
    thursday: [this.route?.weekdays.find(day => day === "Jueves")],
    friday: [this.route?.weekdays.find(day => day === "Viernes")],
    saturday: [this.route?.weekdays.find(day => day === "Sábado")],
    sunday: [this.route?.weekdays.find(day => day === "Domingo")]
  }


  form = this.formBuilder.group(this.fields)


  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private routeService: RouteService,
    private routeStorage: RouteStorage,
    private spinnerService: SpinnerService
  ) { }


  get isFormValid(): boolean {
    return this.form.valid && this.atLeastOneCheckboxSelected();
  }

  async createRoute() {
    try {
      if (this.form.valid && this.atLeastOneCheckboxSelected()) {
        const weekdays = this.getSelectedDays();
        const name: string = this.form.get('name')?.value ?? '';
        const location: string = this.form.get('location')?.value ?? '';
        const price: number = this.form.get('price')?.value ?? 0;

        this.close();
        this.spinnerService.showSpinner(true);
        await this.routeService.addRoute(name, location, price, weekdays);
        showPopUp('La ruta se ha creado exitosamente', 'success');
      }
    } catch (error) {
      showPopUp('Ha ocurrido un error al crear la ruta, vuelve a intentarlo', 'error');
    }
    this.spinnerService.showSpinner(false);
  }

  async updateRoute() {
    try {
      if (this.form.valid && this.atLeastOneCheckboxSelected()) {
        const id = this.route?.id ?? -1
        const weekdays = this.getSelectedDays();
        const name: string = this.form.get('name')?.value ?? '';
        const location: string = this.form.get('location')?.value ?? '';
        const price: number = this.form.get('price')?.value ?? 0;

        this.close();
        this.spinnerService.showSpinner(true);
        await this.routeService.updateRoute(id, name, location, price, weekdays);
        showPopUp('La ruta se ha actualizado exitosamente', 'success');
      }
    } catch (error) {
      showPopUp('Ha ocurrido un error al actualizar la ruta, vuelve a intentarlo', 'error');
    }
    this.spinnerService.showSpinner(false);
  }

  atLeastOneCheckboxSelected(): boolean {
    const checkboxes = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return checkboxes.some(checkbox => this.form.get(checkbox)?.value);
  }

  getSelectedDays(): string[] {
    const checkboxes = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return checkboxes.filter(day => this.form.get(day)?.value)
      .map(day => day.charAt(0).toUpperCase() + day.slice(1));;
  }


  close() {
    this.modalService.close();
  }

}
