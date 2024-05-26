import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppStorage } from 'src/app/app.storage';
import { ClientStorage } from 'src/app/modules/clients/client.storage';
import { getStartDayCurrent } from 'src/app/utils/DateUtils';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { SpinnerService } from 'src/data/services/spinner.service';
import { TransactionService } from 'src/data/services/transaction.service';
import { PresalesStorage } from '../../../../../presales/presales.storage';
import { User } from 'src/data/models/user';
import { UserService } from 'src/data/services/user.service';

@Component({
  selector: 'app-containers-modal',
  templateUrl: './containers-modal.component.html',
  styleUrls: ['./containers-modal.component.css'],
})
export class ContainersModalComponent implements OnInit {
  formContainers: FormGroup = this.fb.group({
    value: [
      this.clientStorage.actualClient?.borrowedContainers,
      [Validators.required, Validators.min(1)],
    ],
    type: ['RETURNED', Validators.required],
    user_id: [parseInt(localStorage.getItem('lastUserTransaction') ?? this.appStorage.user.id), Validators.required]
  });
  users: User[] = []

  constructor(
    public clientStorage: ClientStorage,
    private transactionService: TransactionService,
    private spinner: SpinnerService,
    private dialogRef: MatDialogRef<ContainersModalComponent>,
    private appStorage: AppStorage,
    private distributionStorage: PresalesStorage,
    private fb: FormBuilder,
    private userService: UserService,
    private presalesStorage: PresalesStorage
  ) { }

  async ngOnInit() {
    if (
      this.appStorage.actualRol == 'Distribuidor' &&
      this.appStorage.moduleActual == 'Distribución'
    ) {
      await this.getDistributionUsers();
    } else {
      this.users = [this.appStorage.user];
    }
  }

  close() {
    this.dialogRef.close();
  }

  async getDistributionUsers() {
    try {
      this.spinner.showSpinner(true);
      this.users = await this.userService.getDistributionUsers({
        distribution_id: this.presalesStorage.actualDistribution!.id,
      });
    } catch (error) {
      showPopUp('Error al traer los usuarios de la distribucion', 'error');
    }
    this.spinner.showSpinner(false);
  }

  async createContainer() {
    try {
      this.spinner.showSpinner(true);
      await this.transactionService.createTransactionContainer({
        date: getStartDayCurrent().format(),
        customer_id: this.clientStorage.actualClient!.id,
        product_inventory_id: 1,
        distribution_id: this.distributionStorage.actualDistribution?.id,
        ...this.formContainers.value,
      });
      this.clientStorage.actualClient!.borrowedContainers +=
        this.formContainers.value.type == 'BORROWED'
          ? this.formContainers.value.value
          : -this.formContainers.value.value;
      localStorage.setItem(
        'lastUserTransaction',
        this.formContainers.value.user_id
      );
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
