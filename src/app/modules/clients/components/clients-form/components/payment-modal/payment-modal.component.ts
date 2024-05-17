import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppStorage } from 'src/app/app.storage';
import { ClientStorage } from 'src/app/modules/clients/client.storage';
import { PresalesStorage } from 'src/app/modules/presales/presales.storage';
import { getStartDayCurrent } from 'src/app/utils/DateUtils';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { SpinnerService } from 'src/data/services/spinner.service';
import { TransactionService } from 'src/data/services/transaction.service';
import { UserService } from 'src/data/services/user.service';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.css'],
})
export class PaymentModalComponent implements OnInit {
  chips = [
    {
      name: 'Abono',
      selected: true,
    },
    {
      name: 'Deuda',
      selected: false,
    },
  ];
  valueControl = new FormControl(this.clientStorage.actualClient!.totalDebt, [Validators.max(this.chips[0].selected ? this.clientStorage.actualClient!.totalDebt : 999999), Validators.min(0)])
  formPayment: FormGroup = this.fb.group({
    value: this.valueControl,
    payment_method: 'EFECTIVO',
    user_id:
      parseInt(localStorage.getItem('lastUserTransaction') ?? '0') ??
      this.appStorage.user.id,
  });
  methods = ['Efectivo', 'Nequi', 'Daviplata', 'Bancolombia'];
  users: any = [];

  constructor(
    public clientStorage: ClientStorage,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentModalComponent>,
    private transactionService: TransactionService,
    private spinner: SpinnerService,
    public appStorage: AppStorage,
    private userService: UserService,
    private preSaleStorage: PresalesStorage
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

  async getDistributionUsers() {
    try {
      this.spinner.showSpinner(true);
      this.users = await this.userService.getDistributionUsers({
        distribution_id: this.preSaleStorage.actualDistribution!.id,
      });
    } catch (error) {
      showPopUp('Error al traer los usuarios de la distribucion', 'error');
    }
    this.spinner.showSpinner(false);
  }

  async createPayment() {
    try {
      this.spinner.showSpinner(true);
      await this.transactionService.createTransactionPayment({
        date: getStartDayCurrent().format(),
        type: this.isAbonos() ? 'PAID' : 'DEBT',
        customer_id: this.clientStorage.actualClient!.id,
        ...this.formPayment.value,
      });
      if (this.isAbonos()) {
        this.clientStorage.actualClient!.totalDebt -=
          this.formPayment.value.value;
      } else {
        this.clientStorage.actualClient!.totalDebt +=
          this.formPayment.value.value;
      }
      localStorage.setItem(
        'lastUserTransaction',
        this.formPayment.value.user_id
      );
      showPopUp(
        this.isAbonos()
          ? 'Abono registrado con éxito'
          : 'Deuda registrada con éxito',
        'success'
      );
      this.clientStorage.setObservableValue(true, 'reloadTransactionPayment');
    } catch (error) {
      showPopUp('Error al registrar un abono', 'error');
    }
    this.dialogRef.close();
    this.spinner.showSpinner(false);
  }

  close() {
    this.dialogRef.close();
  }

  selectOption(option: number) {
    if (option == 0) {
      this.valueControl.setValidators([Validators.max(this.clientStorage.actualClient!.totalDebt), Validators.min(0)])
      this.valueControl.setValue(this.clientStorage.actualClient!.totalDebt)
      this.chips[0].selected = true;
      this.chips[1].selected = false;
    } else {
      this.valueControl.setValidators([Validators.max(Infinity), Validators.min(0)])
      this.valueControl.setValue(10000)
      this.chips[0].selected = false;
      this.chips[1].selected = true;
    }
  }

  isAbonos(): any {
    return this.chips[0].selected;
  }

  toInt(number: string): number {
    return parseInt(number)
  }
}
