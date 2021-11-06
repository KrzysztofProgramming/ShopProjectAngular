import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-cart',
  template: `
    <p>
      cart works!
    </p>
  `,
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
