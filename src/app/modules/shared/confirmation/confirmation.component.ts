import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  @Input() cancel: string = 'Cancelar'
  @Input() ok: string = 'Aceptar'

  @Output() confirmate : EventEmitter<void> = new EventEmitter()

  constructor(private dialogRef: MatDialogRef<ConfirmationComponent>){ }

  close(){
    this.dialogRef.close();
  }

  confirmateOk(){
    this.confirmate.emit();
    this.dialogRef.close();
  }
}
