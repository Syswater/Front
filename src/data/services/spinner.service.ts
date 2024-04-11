import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  IsShowSpinner = false
  constructor() { }

  showSpinner(b: boolean) {
    this.IsShowSpinner = b
  }
}
