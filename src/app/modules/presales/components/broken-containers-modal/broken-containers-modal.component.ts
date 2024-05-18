import { Component } from '@angular/core';
import { PresalesStorage } from '../../presales.storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DistributionService } from 'src/data/services/distribution.service';
import { SpinnerService } from 'src/data/services/spinner.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-broken-containers-modal',
  templateUrl: './broken-containers-modal.component.html',
  styleUrls: ['./broken-containers-modal.component.css'],
})
export class BrokenContainersModalComponent {
  formBrokenContainers: FormGroup = this.fb.group({
    broken_containers: [this.preSaleStorage.actualDistribution?.broken_containers, [Validators.min(0), Validators.required]],
  });

  constructor(
    public preSaleStorage: PresalesStorage,
    private fb: FormBuilder,
    private distributionService: DistributionService,
    private spinner: SpinnerService,
    private dialogRef: MatDialogRef<BrokenContainersModalComponent>
  ) {}

  async updateBrokenContainers() {
    try {
      this.spinner.showSpinner(true)
      await this.distributionService.updateDistribution({
        id: this.preSaleStorage.actualDistribution!.id,
        broken_containers: this.formBrokenContainers.value.broken_containers
      });
      showPopUp('Envases rotos actualizados con éxito', 'success');
      this.preSaleStorage.setObservableValue(true, 'reloadClients');
      this.preSaleStorage.actualDistribution!.broken_containers = this.formBrokenContainers.value.broken_containers
      localStorage.setItem('sales-actualDistribution', JSON.stringify(this.preSaleStorage.actualDistribution))
      this.dialogRef.close()
    } catch (error) {
      showPopUp('Error al actualizar los envases rotos', 'error')
    }
    this.spinner.showSpinner(false)
  }

  incrementQuanty() {
    this.formBrokenContainers.get('broken_containers')!.setValue(this.formBrokenContainers.get('broken_containers')!.value + 1)
  }

  decrementQuanty() {
    if (this.formBrokenContainers.get('broken_containers')!.value > 0) this.formBrokenContainers.get('broken_containers')!.setValue(this.formBrokenContainers.get('broken_containers')!.value - 1)
  }

  close() {
    this.dialogRef.close()
  }
}
