import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PresalesStorage } from '../../presales.storage';

@Component({
  selector: 'app-value-paid-modal',
  templateUrl: './value-paid-modal.component.html',
  styleUrls: ['./value-paid-modal.component.css']
})
export class ValuePaidModalComponent implements OnInit {
  price: any;
  value_to_paid: any;

  constructor(public preSaleStorage: PresalesStorage, private dialogRef: MatDialogRef<ValuePaidModalComponent>) { }

  ngOnInit(): void {
    let quantity = 0
    if(this.preSaleStorage.actualClientDistribution.sale){
      this.price = this.preSaleStorage.actualClientDistribution.sale.value_paid
      quantity = this.preSaleStorage.actualClientDistribution.sale.amount
      this.value_to_paid = quantity * this.preSaleStorage.actualClientDistribution.sale.unit_value
    }else{
      if (this.preSaleStorage.actualClientDistribution.order) {
        quantity = this.preSaleStorage.actualClientDistribution.order.amount
      } else {
        quantity = this.preSaleStorage.actualClientDistribution.quantity
      }
      this.price = quantity * this.preSaleStorage.actualClientDistribution.unit_value
      this.value_to_paid = quantity * this.preSaleStorage.actualClientDistribution.unit_value
    }
  }

  saveAndClose() {
    if (this.preSaleStorage.actualClientDistribution.sale){
      this.preSaleStorage.actualClientDistribution.sale.value_paid = this.price
    }else{
      this.preSaleStorage.actualClientDistribution.value_paid = this.price
    }
    this.dialogRef.close()
  }

  cancel() {
    this.dialogRef.close()
  }

  decrementPrice() {
    if (this.price > 500) this.price -= 500
  }

  incrementPrice() {
    if (this.price < this.value_to_paid) this.price += 500
  }
}
