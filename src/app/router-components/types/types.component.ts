import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-types',
  template: `
    <shop-types-list></shop-types-list>
  `,
    styles: [`
    @import "../../../styling/all.scss";
    
    :host{
      @include flex-fill-space;
      display: flex;
      max-width: $max-router-width;
      padding: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
