import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { Sale } from '../models/sale';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  async getAllProductInventory() {
    return firstValueFrom(this.http.get<Product[]>(`${this.url}/product/findAll`));
  }

}
