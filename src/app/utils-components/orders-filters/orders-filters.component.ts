import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-orders-filters',
  template: `
    <p class="header">Filtry</p>
    <div class="price-filter filter">
      <p-inputNumber class="price-input"></p-inputNumber>
      <p-inputNumber class="price-input"></p-inputNumber>
    </div>
    <div class="date-filter filter">
      <p-calendar class="date-input"></p-calendar>
      <p-calendar class="date-input"></p-calendar>
    </div>
  `,
  styleUrls: ['./orders-filters.component.scss']
})
export class OrdersFiltersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
