import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent {
  @Input() href: string = '#';
  @Input() text: string = 'Entrar';
  @Input() label: string = '';    
}
