import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[shopButton]',
  host:{
    '[class.d-button]': 'true',
    '[class.d-button--red]': "color === 'red'",
    '[class.d-button--blue]': "color === 'blue'"
  }
})
export class ButtonDirective {
  @Input() color: 'blue' | 'red' = "blue";
  constructor() { }

}
