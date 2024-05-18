import { Component } from '@angular/core';
import { PresalesStorage } from '../../presales.storage';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { DistributionService } from 'src/data/services/distribution.service';
import { SpinnerService } from 'src/data/services/spinner.service';

@Component({
  selector: 'app-close-request-distribution',
  templateUrl: './close-request-distribution.component.html',
  styleUrls: ['./close-request-distribution.component.css']
})
export class CloseRequestDistributionComponent {
  constructor(
    private spinner: SpinnerService,
    private distributionService: DistributionService,
    public preSaleStorage: PresalesStorage
  ) { }

  async rejectCloseRequest() {
    try {
      this.spinner.showSpinner(true);
      await this.distributionService.changeStatusDistribution({
        id: this.preSaleStorage.actualDistribution!.id,
        status: "CLOSE_REQUEST"
      })
      showPopUp('Solicitud de cierre creada exitosamente', 'success')
    } catch (error) {
      showPopUp('Error al crear la solicitud de cierre', 'error')
    }
    this.spinner.showSpinner(false)
  }
}
