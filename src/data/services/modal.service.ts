import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  showX = true

  constructor(private matDialog: MatDialog) { }

  open(component: ComponentType<any>, onClose?: () => void): () => void {
    const ref = this.matDialog.open(component);
    firstValueFrom(ref.afterClosed()).then(onClose);
    return () => ref.close();
  }

  close() {
    const dialogRef = this.matDialog.openDialogs.pop();
    if (dialogRef) {
      dialogRef.close();
    }
  }
}
