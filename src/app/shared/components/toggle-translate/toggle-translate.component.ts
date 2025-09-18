import { Component, OnInit, EventEmitter, Output  } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-toggle-translate',
  templateUrl: './toggle-translate.component.html',
  styleUrls: ['./toggle-translate.component.scss'],
})
export class ToggleTranslateComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

    isSpanish: boolean = true;

  @Output() languageChange = new EventEmitter<string>();

  toggleLanguage() {
    this.isSpanish = !this.isSpanish;
    this.languageChange.emit(this.isSpanish ? 'es' : 'en');
  }
  
}
