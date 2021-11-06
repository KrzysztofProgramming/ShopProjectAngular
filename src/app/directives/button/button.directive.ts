import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[shopButton]',
  host:{
    '[class.d-button]': 'true',
    '[class.d-button--red]': "color === 'red'",
    '[class.d-button--blue]': "color === 'blue'",
    '[class.d-button--gray]': "color === 'gray'",
    '[class.d-button--orange]': "color === 'orange'",
    '[class.d-button--green]': "color === 'green'",
    '[class.d-button--padding-medium]': "padding === 'medium'",
    '[class.d-button--padding-large]': "padding === 'large'"
  }
})
export class ButtonDirective {
  @Input() color: 'blue' | 'red' | 'gray' | 'orange' | 'green' = "blue";
  @Input() padding: 'large' | 'medium' = 'large';
  constructor() { }

}
