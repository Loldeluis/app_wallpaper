import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  // 👇 Inputs que vienen del HTML
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;

  // Valor interno del input
  value: any = '';

  // Callbacks inyectados por Angular Forms
  private onChange = (_: any) => {};
  private onTouched = () => {};

  // 👇 Métodos de ControlValueAccessor
  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // 👇 Se llama cuando el usuario escribe
  onInput(event: any) {
    const newValue = event.target.value;
    this.value = newValue;
    this.onChange(newValue); // notifica a Angular Forms
  }

  // 👇 Se llama cuando el input pierde foco
  onBlur() {
    this.onTouched();
  }
}
