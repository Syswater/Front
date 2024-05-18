import { Component } from '@angular/core';
import { RouteStorage } from '../../route.storage';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { DistributionService } from 'src/data/services/distribution.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-accept-distribution',
  templateUrl: './confirm-accept-distribution.component.html',
  styleUrls: ['./confirm-accept-distribution.component.css']
})
export class ConfirmAcceptDistributionComponent {

  constructor(
    public routeStorage: RouteStorage,
    private spinner: SpinnerService,
    private distributionService: DistributionService,
    private dialogRef: MatDialogRef<ConfirmAcceptDistributionComponent>
  ) { }

  async confirmCloseRequest() {
    try {
      this.spinner.showSpinner(true);
      await this.distributionService.closeDistribution({
        distribution_id: this.routeStorage.actualRoute!.distribution_id,
      })
      showPopUp('Cierre de distribución realizado con éxito', 'success');
      this.dialogRef.close()
      this.routeStorage.setObservableValue(true, 'reloadRoutes');
    } catch (error) {
      showPopUp('Error al aceptar la solicitud de cierre', 'error')
    }
    this.spinner.showSpinner(false)
  }
}
