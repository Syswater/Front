import { Component } from '@angular/core';
import { RouteStorage } from '../../route.storage';
import { SpinnerService } from 'src/data/services/spinner.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { DistributionService } from 'src/data/services/distribution.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-reject-distribution',
  templateUrl: './confirm-reject-distribution.component.html',
  styleUrls: ['./confirm-reject-distribution.component.css'],
})
export class ConfirmRejectDistributionComponent {
  constructor(
    public routeStorage: RouteStorage,
    private spinner: SpinnerService,
    private distributionService: DistributionService,
    private dialogRef: MatDialogRef<ConfirmRejectDistributionComponent>
  ) { }

  async rejectCloseRequest() {
    try {
      this.spinner.showSpinner(true);
      await this.distributionService.changeStatusDistribution({
        id: this.routeStorage.actualRoute!.distribution_id,
        status: "OPENED"
      })
      showPopUp('Solicitud de cierre rechazada exitosamente', 'success')
      this.dialogRef.close()
      this.routeStorage.setObservableValue(true, 'reloadRoutes');
    } catch (error) {
      showPopUp('Error al rechazar la solicitud de cierre', 'error')
    }
    this.spinner.showSpinner(false)
  }
}
