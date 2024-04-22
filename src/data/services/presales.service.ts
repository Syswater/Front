import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { Presale } from '../models/presale';

@Injectable({
  providedIn: 'root'
})
export class PresalesService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  async getPresales(options: { distribution_id: number }) {
    const { distribution_id } = options
    const params = new HttpParams()
      .set('distribution_id', distribution_id)
    return firstValueFrom(this.http.get<Presale[]>(`${this.url}/order/findAll`, { params }));
  }

}
