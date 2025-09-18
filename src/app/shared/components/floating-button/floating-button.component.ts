import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent {
  @Input() icon: string = '+';  // Texto o icono
}
