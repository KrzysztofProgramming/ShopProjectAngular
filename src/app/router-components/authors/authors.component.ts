import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-authors',
  template: `
    <shop-authors-list></shop-authors-list>
  `,
  styles: [`
    @import "../../../styling/all.scss";
    
    :host{
      @include flex-fill-space;
      display: flex;
      flex-direction: row;
      max-width: $max-router-width;
      padding: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
