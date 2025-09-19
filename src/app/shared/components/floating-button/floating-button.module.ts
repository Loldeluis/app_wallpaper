import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonComponent } from './floating-button.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [FloatingButtonComponent],
  imports: [CommonModule, IonicModule],
  exports: [FloatingButtonComponent]
})
export class FloatingButtonModule { }
