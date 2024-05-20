import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppStorage } from 'src/app/app.storage';
import { ClientStorage } from 'src/app/modules/clients/client.storage';
import { getStartDayCurrent } from 'src/app/utils/DateUtils';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { SpinnerService } from 'src/data/services/spinner.service';
import { TransactionService } from 'src/data/services/transaction.service';
import { DashboardDistributorStorage } from '../../../../../dashboard-distributor/dashboard-distributor.storage';
import { PresalesStorage } from '../../../../../presales/presales.storage';

@Component({
  selector: 'app-containers-modal',
  templateUrl: './containers-modal.component.html',
  styleUrls: ['./containers-modal.component.css'],
})
export class ContainersModalComponent {
  formContainers: FormGroup = this.fb.group({
    value: [
      this.clientStorage.actualClient?.borrowedContainers,
      [Validators.required, Validators.min(1)],
    ],
    type: ['RETURNED', Validators.required],
  });

  constructor(
    public clientStorage: ClientStorage,
    private transactionService: TransactionService,
    private spinner: SpinnerService,
    private dialogRef: MatDialogRef<ContainersModalComponent>,
    private appStorage: AppStorage,
    private distributionStorage: PresalesStorage,
    private fb: FormBuilder
  ) {}

  close() {
    this.dialogRef.close();
  }

  async createContainer() {
    try {
      this.spinner.showSpinner(true);
      await this.transactionService.createTransactionContainer({
        date: getStartDayCurrent().format(),
        customer_id: this.clientStorage.actualClient!.id,
        product_inventory_id: 1,
        user_id: this.appStorage.user.id,
        distribution_id: this.distributionStorage.actualDistribution?.id,
        ...this.formContainers.value,
      });
      this.clientStorage.actualClient!.borrowedContainers +=
        this.formContainers.value.type == 'BORROWED'
          ? this.formContainers.value.value
          : -this.formContainers.value.value;
      showPopUp('Transacción creada con éxito', 'success');
      this.clientStorage.setObservableValue(
        true,
        'reloadTransactionContainers'
      );
      this.dialogRef.close();
    } catch (error) {
      showPopUp('Error al crear la transacción', 'error');
    }
    this.spinner.showSpinner(false);
  }
}
