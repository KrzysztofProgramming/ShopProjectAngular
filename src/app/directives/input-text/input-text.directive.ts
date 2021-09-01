import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[shopInputText]',
  host:{
    '[class.d-input-text]': 'true',
    '[class.d-input-text--invalid]': 'invalid'
  }
})
export class InputTextDirective {
  @Input() invalid: boolean = false;
  constructor() {}
}
