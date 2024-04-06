import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'src/data/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    public modalService: ModalService
  ) { }

  close() {
    this.dialogRef.close();
  }
}
