import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent {
    isOpen = false;

 @Input() imageSrc: string = ''; // Ruta de la imagen principal
  @Output() logoutClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

    onLogoutClick() {
    this.logoutClick.emit();
    this.isOpen = false; // opcional, cerrar menú después
  }

    onProfileClick() {
    this.profileClick.emit();
    this.isOpen = false;
  }


  @Input() icon: string = '+';  // Texto o icono
 
}
