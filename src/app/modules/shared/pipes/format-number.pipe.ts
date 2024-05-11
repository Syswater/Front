import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumberMiles'
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Convertir el número a string
    let stringValue = value.toString();

    // Separar los miles con puntos
    stringValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Separar los millones con comas
    if (stringValue.length > 6) {
      const millones = stringValue.slice(0, -6);
      const miles = stringValue.slice(-6);
      stringValue = millones + "'" + miles;
    }

    return stringValue;
  }
}