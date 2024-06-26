import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';
import { Client } from '../models/client';
import { Observation } from '../models/observation';
import { SpinnerService } from './spinner.service';
import { showPopUp } from 'src/app/utils/SwalPopUp';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  url = environment.API_URL

  constructor(private http: HttpClient, private spinner: SpinnerService) { }

  async getListClients(options: { route_id?: number, distribution_id?: number, filter?: string, with_notes?: boolean, with_order?: boolean, with_sale?: boolean }) {
    const { route_id, filter, with_notes, with_order, distribution_id, with_sale } = options
    let params = new HttpParams()
    if (filter) params = params.set('filter', filter)
    if (with_notes) params = params.set('with_notes', with_notes)
    if (with_order) params = params.set('with_order', with_order)
    if (distribution_id) params = params.set('distribution_id', distribution_id)
    if (route_id) params = params.set('route_id', route_id)
    if (with_sale) params = params.set('with_sale', with_sale)
    return firstValueFrom(this.http.get<Client[]>(`${this.url}/customer/findAll`, { params }));
  }

  async deleteClient(id?: number) {
    return firstValueFrom(this.http.delete(`${this.url}/customer/delete`, { body: { id } }));
  }

  async createNote(noteToInsert: any) {
    return firstValueFrom(this.http.post<Observation>(`${this.url}/note/create`, { ...noteToInsert }));
  }

  async updateNote(noteToPut: any) {
    return firstValueFrom(this.http.put(`${this.url}/note/update`, { ...noteToPut }));
  }

  async createClient(client: { address?: string | null | undefined; neighborhood?: string | null | undefined; route_order?: number | null | undefined; tape_preference?: string | null | undefined; is_contactable?: boolean | null | undefined; name?: string | null | undefined; cellphone?: string | null | undefined; route_id?: number | null | undefined; }) {
    return firstValueFrom(this.http.post(`${this.url}/customer/create`, { ...client }));
  }

  async updateClient(client: Partial<{ id: number | null | undefined; address: string | null | undefined; neighborhood: string | null | undefined; route_order: number | null; tape_preference: string | null; is_contactable: boolean | null; name: string | null | undefined; cellphone: string | null | undefined; borrowedContainers: number | null; totalDebt: number | null; route_id: number | null | undefined; is_served?: boolean }>) {
    return firstValueFrom(this.http.put(`${this.url}/customer/update`, { ...client }));
  }

  async deleteNote(id: number | undefined) {
    return firstValueFrom(this.http.delete(`${this.url}/note/delete`, { body: { id } }));
  }
}