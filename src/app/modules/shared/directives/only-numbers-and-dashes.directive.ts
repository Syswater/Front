import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appOnlyNumbersAndDashes]'
})
export class OnlyNumbersAndDashesDirective {

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.ngControl.control?.value;
    this.ngControl.control?.setValue(initialValue.replace(/[^0-9-]/g, ''));
    if (initialValue !== this.ngControl.control?.value) {
      event.stopPropagation();
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    const allowedChars = '0123456789-';
    const inputChar = event.key;

    if (allowedChars.indexOf(inputChar) === -1) {
      event.preventDefault();
    }
  }
}
