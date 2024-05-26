import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PresalesStorage } from '../../presales.storage';
import { User } from 'src/data/models/user';
import { UserService } from 'src/data/services/user.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';

@Component({
  selector: 'app-value-paid-modal',
  templateUrl: './value-paid-modal.component.html',
  styleUrls: ['./value-paid-modal.component.css']
})
export class ValuePaidModalComponent implements OnInit {
  actualUser: number = 0;
  users: User[] = [];
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
  lastPrice: number = 0

  constructor(private userService: UserService, public preSaleStorage: PresalesStorage, private dialogRef: MatDialogRef<ValuePaidModalComponent>) { }

  async ngOnInit() {
    await this.getUsersDistribution()
    let quantity = 0
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.price = this.preSaleStorage.actualClientDistribution.sale.value_paid
      this.lastPrice = this.preSaleStorage.actualClientDistribution.sale.value_paid
      quantity = this.preSaleStorage.actualClientDistribution.sale.amount
      this.value_to_paid = quantity * this.preSaleStorage.actualClientDistribution.sale.unit_value
    } else {
      this.lastPrice = 0
      if (this.preSaleStorage.actualClientDistribution.order) {
        quantity = this.preSaleStorage.actualClientDistribution.order.amount
      } else {
        quantity = this.preSaleStorage.actualClientDistribution.quantity
      }
      this.price = quantity * this.preSaleStorage.actualClientDistribution.unit_value
      this.value_to_paid = quantity * this.preSaleStorage.actualClientDistribution.unit_value
    }
    switch (this.preSaleStorage.actualClientDistribution.payment_method) {
      case 'EFECTIVO':
        this.actualMethod = 0;
        break;
      case 'NEQUI':
        this.actualMethod = 1;
        break;
      case 'DAVIPLATA':
        this.actualMethod = 2;
        break;
      case 'BANCOLOMBIA':
        this.actualMethod = 3;
        break;
    }
    if(this.preSaleStorage.actualClientDistribution.sale){
      for (let i = 0; i < this.users.length; i++) {
        if(this.users[i].id == this.preSaleStorage.actualClientDistribution.sale.user_id){
          this.actualUser = i
        }
      }
    }else{
      this.actualUser = 0
    }
  }

  async getUsersDistribution() {
    try {
      this.users = await this.userService.getDistributionUsers({
        distribution_id: this.preSaleStorage.actualDistribution!.id
      })
    } catch (error) {
      showPopUp('Error al obtener los usuarios de la distribución',  'error');
    }
  }

  saveAndClose() {
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.preSaleStorage.actualClientDistribution.sale.value_paid = this.price
    } else {
      this.preSaleStorage.actualClientDistribution.value_paid = this.price
    }
    this.preSaleStorage.actualClientDistribution.user_name = this.users[this.actualUser].name
    this.preSaleStorage.actualClientDistribution.user_id = this.users[this.actualUser].id
    console.log(this.preSaleStorage.actualClientDistribution.user_id)
    const method = this.methods[this.actualMethod] as keyof typeof this.method_enum;
    this.preSaleStorage.actualClientDistribution.payment_method = this.method_enum[method]
    this.dialogRef.close()
  }

  cancel() {
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.preSaleStorage.actualClientDistribution.sale.value_paid = this.lastPrice
    } else {
      this.preSaleStorage.actualClientDistribution.value_paid = this.lastPrice
    }
    this.dialogRef.close()
    this.dialogRef.close()
  }

  decrementPrice() {
    if (this.price > 500) this.price -= 500
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.preSaleStorage.actualClientDistribution.sale.value_paid = this.price
    }else{
      this.preSaleStorage.actualClientDistribution.value_paid = this.price
    }
  }

  incrementPrice() {
    if (this.price < this.value_to_paid) this.price += 500
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.preSaleStorage.actualClientDistribution.sale.value_paid = this.price
    }else{
      this.preSaleStorage.actualClientDistribution.value_paid = this.price
    }
  }

  changeMethod(index: number) {
    if (index == 1) {
      if (this.actualMethod < this.methods.length - 1) {
        this.actualMethod++
      } else {
        this.actualMethod = 0
      }
    } else {
      if (this.actualMethod > 0) {
        this.actualMethod--
      } else {
        this.actualMethod = this.methods.length - 1
      }
    }
  }

  changeUser(index: number) {
    if (index == 1) {
      if (this.actualUser < this.users.length - 1) {
        this.actualUser++
      } else {
        this.actualUser = 0
      }
    } else {
      if (this.actualUser > 0) {
        this.actualUser--
      } else {
        this.actualUser = this.users.length - 1
      }
    }
  }

  updateValues(){
    if (this.preSaleStorage.actualClientDistribution.sale) {
      this.preSaleStorage.actualClientDistribution.sale.value_paid = this.price
    }else{
      this.preSaleStorage.actualClientDistribution.value_paid = this.price
    }
  }
}
