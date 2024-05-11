import { Component, OnInit } from '@angular/core';
import { PresalesStorage } from '../../presales.storage';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-quanty-input-modal',
  templateUrl: './quanty-input-modal.component.html',
  styleUrls: ['./quanty-input-modal.component.css']
})
export class QuantyInputModalComponent implements OnInit {

  lastQuanty: number = 0
  lastPrice: number = 0

  quantity: any = 0
  price: number = 0

  constructor(public preSaleStorage: PresalesStorage, private dialogRef: MatDialogRef<QuantyInputModalComponent>) { }

  ngOnInit(): void {
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.quantity = this.preSaleStorage.actualClientDistribution.sale.amount
      this.lastQuanty = this.preSaleStorage.actualClientDistribution.sale.amount
      this.price = this.preSaleStorage.actualClientDistribution.sale.unit_value
      this.lastPrice = this.preSaleStorage.actualClientDistribution.sale.unit_value
    } else if (this.preSaleStorage.actualClientDistribution.order) {
      this.quantity = this.preSaleStorage.actualClientDistribution.order.amount
      this.lastQuanty = this.preSaleStorage.actualClientDistribution.order.amount
      this.price = this.preSaleStorage.actualClientDistribution.unit_value
      this.lastPrice = this.preSaleStorage.actualClientDistribution.unit_value
    } else {
      this.quantity = this.preSaleStorage.actualClientDistribution.quantity
      this.lastQuanty = this.preSaleStorage.actualClientDistribution.quantity
      this.price = this.preSaleStorage.actualClientDistribution.unit_value
      this.lastPrice = this.preSaleStorage.actualClientDistribution.unit_value
    }
  }

  cancel() {
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.preSaleStorage.actualClientDistribution.sale.amount = this.lastQuanty
      this.preSaleStorage.actualClientDistribution.sale.unit_value = this.lastPrice
    } else if (this.preSaleStorage.actualClientDistribution.order) {
      this.preSaleStorage.actualClientDistribution.order.amount = this.lastQuanty
      this.preSaleStorage.actualClientDistribution.unit_value = this.lastPrice
    } else {
      this.preSaleStorage.actualClientDistribution.quantity = this.lastQuanty
      this.preSaleStorage.actualClientDistribution.unit_value = this.lastPrice
    }
    this.dialogRef.close()
  }

  saveAndClose() {
    this.dialogRef.close()
  }

  incrementPrice() {
    this.price += 1000
    if(this.preSaleStorage.actualClientDistribution.sale){
      this.preSaleStorage.actualClientDistribution.sale.unit_value += 1000
    }else{
      this.preSaleStorage.actualClientDistribution.sale.unit_value += 1000
    }
  }

  decrementPrice() {
    if (this.price > 1000) this.price -= 1000
    if(this.preSaleStorage.actualClientDistribution.sale){
      if (this.preSaleStorage.actualClientDistribution.sale.unit_value > 1000) this.preSaleStorage.actualClientDistribution.sale.unit_value -= 1000
    }else{
      if (this.preSaleStorage.actualClientDistribution.unit_value > 1000) this.preSaleStorage.actualClientDistribution.unit_value -= 1000
    }
  }

  incrementQuanty() {
    if (this.quantity == '-') this.quantity = 0;
    this.quantity++
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.preSaleStorage.actualClientDistribution.sale.amount++
    } else if (this.preSaleStorage.actualClientDistribution.order) {
      this.preSaleStorage.actualClientDistribution.order.amount++
    } else {
      if (this.preSaleStorage.actualClientDistribution.quantity == '-') this.preSaleStorage.actualClientDistribution.quantity = 0;
      this.preSaleStorage.actualClientDistribution.quantity++
    }
  }

  decrementQuanty() {
    if (this.quantity > 0) this.quantity--
    if (this.preSaleStorage.actualClientDistribution.sale) {
      if (this.preSaleStorage.actualClientDistribution.sale.amount > 0)
        this.preSaleStorage.actualClientDistribution.sale.amount--
    } else if (this.preSaleStorage.actualClientDistribution.order) {
      if (this.preSaleStorage.actualClientDistribution.order.amount > 0)
        this.preSaleStorage.actualClientDistribution.order.amount--
    } else {
      if (this.preSaleStorage.actualClientDistribution.quantity != '-' && this.preSaleStorage.actualClientDistribution.quantity > 0)
        this.preSaleStorage.actualClientDistribution.quantity--
    }
  }
}
