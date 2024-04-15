import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  url = environment.API_URL

  constructor(private http: HttpClient) { }

  async getListClients(route_id: number, filter?: string, with_notes?: boolean) {
    const params = new HttpParams()
    .set('filter', filter ?? '')
    .set('with_notes', with_notes ?? false)
    .set('route_id', route_id);
    return firstValueFrom(this.http.get<Client[]>(`${this.url}/customer/findAll`, { params }));
  }
  
  async deleteClient(id?: number) {
    return firstValueFrom(this.http.delete(`${this.url}/customer/delete`, { body: { id } }));
  }

}