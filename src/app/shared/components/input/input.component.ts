import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  @Input() label: string = '';        // 👈 esto sí existe
  @Input() type: string = 'text';     // 👈 esto sí existe
  @Input() placeholder: string = '';  // 👈 esto sí existe
}
