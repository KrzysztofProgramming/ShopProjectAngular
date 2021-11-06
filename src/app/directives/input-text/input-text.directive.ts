import { Directive, Input } from '@angular/core';

export type paddingSize = "small" | "normal";

@Directive({
  selector: '[shopInputText]',
  host:{
    '[class.d-input-text]': 'true',
    '[class.d-input-text--invalid]': 'this.invalid',
    '[class.d-input-text--small-padding]': "this.padding === 'small'",
    '[class.d-input-text--normal-padding]': "this.padding === 'normal'"
  }
})
export class InputTextDirective {
  @Input() invalid: boolean = false;
  @Input() padding: paddingSize = "normal";
  constructor() {}
}
