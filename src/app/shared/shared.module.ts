import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa los módulos de los componentes compartidos
import { ButtonModule } from './components/button/button.module';
import { InputModule } from './components/input/input.module';
import { ToggleTranslateModule } from './components/toggle-translate/toggle-translate.module';
import { FloatingButtonModule } from './components/floating-button/floating-button.module';
@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputModule,
    ToggleTranslateModule,
    FloatingButtonModule
  ],
  exports: [
    ButtonModule,
    InputModule,
    ToggleTranslateModule,
    FloatingButtonModule
  ]
})
export class SharedModule {}
