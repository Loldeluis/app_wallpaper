import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingButtonComponent } from './floating-button.component';


@NgModule({
  declarations: [FloatingButtonComponent],
  imports: [CommonModule],
  exports: [FloatingButtonComponent]
})
export class FloatingButtonModule { }
