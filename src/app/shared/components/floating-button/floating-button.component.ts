import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent {
    isOpen = false;

 @Output() logoutClick = new EventEmitter<void>();
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
  
    onLogoutClick() {
    this.logoutClick.emit();
    this.isOpen = false; // opcional, cerrar menú después
  }
  @Input() icon: string = '+';  // Texto o icono
 
}
