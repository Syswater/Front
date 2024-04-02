import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() height: number = 0
  @Input() color: string = ''
  @Input() title: string = ''
  @Input() subtitle: string = ''
  @Input() subfooter: string = ''
  @Input() footer: string = ''
  @Input() img_path: string = ''
}
