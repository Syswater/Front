import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-circle-button',
  templateUrl: './circle-button.component.html',
  styleUrls: ['./circle-button.component.css']
})
export class CircleButtonComponent {
  @Input() size: number = 30
  @Input() text: string = '-'
  @Input() color: string = 'red'
}
