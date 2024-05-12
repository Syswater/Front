import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppStorage } from 'src/app/app.storage';
import { ClientStorage } from 'src/app/modules/clients/client.storage';
import { getStartDayCurrent } from 'src/app/utils/DateUtils';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { SpinnerService } from 'src/data/services/spinner.service';
import { TransactionService } from 'src/data/services/transaction.service';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css'],
})
export class PaymentModalComponent {
  formPayment: FormGroup = this.fb.group({
    value: this.clientStorage.actualClient!.totalDebt,
    payment_method: 'EFECTIVO',
  });
  methods = ['Efectivo', 'Nequi', 'Daviplata', 'Bancolombia'];

  constructor(
    public clientStorage: ClientStorage,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentModalComponent>,
    private transactionService: TransactionService,
    private spinner: SpinnerService,
    private appStorage: AppStorage
  ) {}

  async createPayment() {
    try {
      this.spinner.showSpinner(true)
      await this.transactionService.createTransactionPayment({
        date: getStartDayCurrent().format(),
        type: 'PAID',
        customer_id: this.clientStorage.actualClient!.id,
        user_id: this.appStorage.user.id,
        ...this.formPayment.value
      })
      this.clientStorage.actualClient!.totalDebt -= this.formPayment.value.value
      showPopUp('Abono registrado con éxito', 'success');
      this.clientStorage.setObservableValue(true, 'reloadTransactionPayment')
    } catch (error) {
      showPopUp('Error al registrar un abono', 'error');
    }
    this.dialogRef.close()
    this.spinner.showSpinner(false)
  }

  close() {
    this.dialogRef.close()
  }
}
