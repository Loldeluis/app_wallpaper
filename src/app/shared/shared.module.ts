import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa los módulos de los componentes compartidos
import { ButtonModule } from './components/button/button.module';
import { InputModule } from './components/input/input.module';
import { ToggleTranslateModule } from './components/toggle-translate/toggle-translate.module';
import { FloatingButtonModule } from './components/floating-button/floating-button.module';
import { CardModule } from './components/card/card.module';
import { LinkModule } from './components/link/link.module';
import { TranslateModule } from '@ngx-translate/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputModule,
    ToggleTranslateModule,
    FloatingButtonModule,
    CardModule,
    LinkModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  exports: [
    ButtonModule,
    InputModule,
    ToggleTranslateModule,
    FloatingButtonModule,
    CardModule,
    LinkModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class SharedModule {}
