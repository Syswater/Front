import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../../../../data/services/modal.service';
import { FormBuilder, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-route-form',
  templateUrl: './route-form.component.html',
  styleUrls: ['./route-form.component.css']
})
export class RouteFormComponent {

  selectedDays = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  };

  form = this.formBuilder.group(this.selectedDays)


  constructor(private dialogRef: MatDialogRef<RouteFormComponent>,
    private modalService: ModalService,
    private formBuilder: FormBuilder) { }

  showDelete(element: any) {
    this.modalService.open(RouteFormComponent, () => { });
  }

}
