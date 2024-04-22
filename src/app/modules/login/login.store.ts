import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginStore {
  roles: string[] = []
}
