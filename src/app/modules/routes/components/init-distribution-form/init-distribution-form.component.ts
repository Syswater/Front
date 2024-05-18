import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouteStorage } from '../../route.storage';
import { SpinnerService } from 'src/data/services/spinner.service';
import { DistributionService } from 'src/data/services/distribution.service';
import { UserService } from 'src/data/services/user.service';
import { ProductService } from 'src/data/services/product.service';
import { Product } from 'src/data/models/product';
import { User } from 'src/data/models/user';
import { showPopUp } from 'src/app/utils/SwalPopUp';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-init-distribution-form',
  templateUrl: './init-distribution-form.component.html',
  styleUrls: ['./init-distribution-form.component.css'],
})
export class InitDistributionFormComponent implements OnInit {
  products: Product[] = []
  users: User[] = [];
  usersControl: FormControl = new FormControl('', Validators.required);
  formInitDistribution: FormGroup = this.fb.group({
    load: [10, [Validators.min(0), Validators.required]],
    product_inventory_id: 1,
    distributors_ids: this.usersControl
  });

  constructor(
    private fb: FormBuilder,
    public routeStorage: RouteStorage,
    private spinner: SpinnerService,
    private distributionService: DistributionService,
    private userService: UserService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<InitDistributionFormComponent>
  ) { }

  async ngOnInit() {
    this.spinner.showSpinner(true)
    await this.getProducts();
    await this.getAllUsers();
    this.spinner.showSpinner(false)
  }

  async getAllUsers() {
    try {
      this.users = await this.userService.getAllUsers({ role: 'DISTRIBUTOR' })
    } catch (error) {
      showPopUp('Error al cargar los distribuidores', 'error')
    }
  }

  async getProducts() {
    try {
      this.products = await this.productService.getAllProductInventory();
    } catch (error) {
      showPopUp('Error al cargar los tipos de productos', 'error')
    }
  }

  async initDistribution() {
    try {
      await this.distributionService.openDistribution({
        distribution_id: this.routeStorage.actualRoute!.distribution_id,
        ...this.formInitDistribution.value,
        distributors_ids: this.formInitDistribution.value.distributors_ids.map((d:any) => d.id),
      });
      showPopUp('Distribución abierta con éxito', 'success')
      this.dialogRef.close()
      this.routeStorage.setObservableValue(true, 'reloadRoutes');
    } catch (error) {
      console.error(error)
      showPopUp('Error al abrir la distribución', 'error')
    }
  }

}