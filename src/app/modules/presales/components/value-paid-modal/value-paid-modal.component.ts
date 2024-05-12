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
  methods: string[] = ['Efectivo', 'Nequi', 'Daviplata', 'Bancolombia'];
  actualMethod: number = 0
  method_enum = {
    'Efectivo': 'EFECTIVO',
    'Nequi': 'NEQUI',
    'Daviplata': 'DAVIPLATA',
    'Bancolombia': 'BANCOLOMBIA'
  }

  constructor(public preSaleStorage: PresalesStorage, private dialogRef: MatDialogRef<ValuePaidModalComponent>) { }

  ngOnInit(): void {
    let quantity = 0
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.price = this.preSaleStorage.actualClientDistribution.sale.value_paid
      quantity = this.preSaleStorage.actualClientDistribution.sale.amount
      this.value_to_paid = quantity * this.preSaleStorage.actualClientDistribution.sale.unit_value
    } else {
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
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.preSaleStorage.actualClientDistribution.sale.value_paid = this.price
    } else {
      this.preSaleStorage.actualClientDistribution.value_paid = this.price
    }
    const method = this.methods[this.actualMethod] as keyof typeof this.method_enum;
    this.preSaleStorage.actualClientDistribution.payment_method = this.method_enum[method]
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

  changeMethod(index: number) {
    if(index == 1){
      if(this.actualMethod < this.methods.length - 1){
        this.actualMethod++
      }else{
        this.actualMethod = 0
      }
    } else {
      if(this.actualMethod > 0) {
        this.actualMethod--
      }else{
        this.actualMethod = this.methods.length - 1
      }
    }
  }
}
