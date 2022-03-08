import { ShopOrder, ShopOrderStatuses } from './../../models/models';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shop-order-tile',
  template: `
    <div class="content" *ngIf="this.order">
      <p class="header">Zamówienie <span>{{this.order.issuedDate | date: 'dd/MM/yyyy'}}</span></p>
      <div class="info">
        <div class="info__row">
          <!-- <p><span>{{this.order.issuedDate | date: 'dd/MM/yyyy'}}</span></p> -->
          <p><span>{{this.getStatusString(this.order.status)}}</span></p>
          <p><span>{{this.order.totalPrice | number: "1.2-2"}}</span> zł</p>
          <p><span>{{this.getProductCount(this.order.products)}}</span> produkty</p>
        </div>
      </div>
      <div class="images">
          <shop-product-image *ngFor="let product of productsToRender; trackBy:this.trackByValue" [productId]="product"
          imageResolution="icon">
          </shop-product-image>
      </div>
    </div>
  `,
  styleUrls: ['./order-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderTileComponent implements OnInit {
  order?: ShopOrder
  public productsToRender: string[] = [];

  @Input("order")
  public set orderInput(order: ShopOrder | undefined){
    this.order = order;
    if(!this.order) return;
    this.productsToRender = Object.keys(this.order.products).slice(0, 4);
  }

  public get orderInput(): ShopOrder | undefined{
    return this.order;
  }

  public trackByValue(index: number, value: string): string{
    return value;
  }

  public getStatusString(value: number){
    return value === ShopOrderStatuses.CANCELLED ? "Anulowany" :
    value === ShopOrderStatuses.PAID ? "Zrealizowane" :
    value === ShopOrderStatuses.UNPAID ? "Niezapłacone" : 
    "Nieznany"
  }

  public getProductCount(products: {[key: string]: any}){
    return Object.keys(products).length;
  }

  constructor() { }

  ngOnInit(): void {
  }



}
