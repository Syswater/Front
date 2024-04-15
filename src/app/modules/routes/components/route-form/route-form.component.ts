import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../../../../data/services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';

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
    private formBuilder: FormBuilder) { }

  get isFormValid(): boolean {
    return this.form.valid && this.atLeastOneCheckboxSelected();
  }

  agregarRuta() {
    if (this.form.valid && this.atLeastOneCheckboxSelected()) {
      console.log('Ruta agregada:', this.form.value);
    }
  }

  atLeastOneCheckboxSelected(): boolean {
    const checkboxes = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return checkboxes.some(checkbox => this.form.get(checkbox)?.value);
  }


  close() {
    this.modalService.close();
  }

}
