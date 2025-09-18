import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [InputComponent],
  imports: [CommonModule,
      FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [InputComponent]
})
export class InputModule {}
