import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa los módulos de los componentes compartidos
import { ButtonModule } from './components/button/button.module';
import { InputModule } from './components/input/input.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    InputModule
  ],
  exports: [
    ButtonModule,
    InputModule
  ]
})
export class SharedModule {}
