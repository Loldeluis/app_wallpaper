import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleTranslateComponent } from './toggle-translate.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ToggleTranslateComponent],
  imports: [
    CommonModule,
    IonicModule 
          ],
  exports: [ToggleTranslateComponent]
})
export class ToggleTranslateModule { }
