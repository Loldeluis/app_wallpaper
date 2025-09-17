import { Component, OnInit, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() expand: 'block' | 'full' | 'outline' = 'block';
  @Input() color: string = 'primary';

}
