import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppStorage } from 'src/app/app.storage';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
];

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.css']
})
export class CardInfoComponent {
  @Input() title: string = 'Titulo'
  @Input() button_text: string = 'Ver más'
  @Input() displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  @Input() dataSource = ELEMENT_DATA;
  @Input() href = '';
  @Input() menuSelection: number = 0;

  constructor(private router: Router, private appStorage: AppStorage){}

  redirect() {
    this.appStorage.selectionMenu = this.menuSelection
    this.router.navigate([this.href])
  }
}
