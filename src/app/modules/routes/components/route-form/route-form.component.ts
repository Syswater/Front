import { Component } from '@angular/core';
import { ModalService } from '../../../../../data/services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { RouteService } from '../../../../../data/services/route.service';
import { SpinnerService } from '../../../../../data/services/spinner.service';
import { showPopUp } from '../../../../utils/SwalPopUp';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.css']
})
export class RouteFormComponent {

  fields = {
    name: ['', Validators.required],
    location: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1000)]],
    monday: [false],
    tuesday: [false],
    wednesday: [false],
    thursday: [false],
    friday: [false],
    saturday: [false],
    sunday: [false]
  }

  form = this.formBuilder.group(this.fields)


  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private routeService: RouteService,
    private spinnerService: SpinnerService
  ) { }

  get isFormValid(): boolean {
    return this.form.valid && this.atLeastOneCheckboxSelected();
  }

  async agregarRuta() {
    try {
      if (this.form.valid && this.atLeastOneCheckboxSelected()) {
        const weekdays = this.getSelectedDays();
        const name: string = this.form.get('name')?.value ?? '';
        const location: string = this.form.get('location')?.value ?? '';
        const price: number = this.form.get('price')?.value ?? 0;

        this.close();
        this.spinnerService.showSpinner(true);
        await this.routeService.addRoute(name, location, price, weekdays);
        this.spinnerService.showSpinner(false);

        showPopUp('La ruta se ha creado exitosamente', 'success');
      }
    } catch (error) {
      console.log('error');
      console.log(error);
      this.spinnerService.showSpinner(false);
      showPopUp('Ha ocurrido un error al crear la ruta, vuelve a intentarlo', 'error');
    }
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
