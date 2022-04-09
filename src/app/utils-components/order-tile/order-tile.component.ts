import { ShopOrder, OrderStatuses, getStatusString } from './../../models/models';
import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'shop-order-tile',
  template: `
    <ng-container class="content" *ngIf="this.order">
      <div class="info">
        <p class="info__date">{{this.order.issuedDate | date: 'dd.MM.yyyy'}}</p>
        <p class="info__status" [ngClass]="this.statusClasses">{{statusString}}</p>
        <p class="info__price">{{this.order.totalPrice | number: "1.2-2"}} zł</p>
        <p>{{this.getProductCount(this.order.products)}} produkty</p>
      </div>
      <div class="images">
          <shop-product-image *ngFor="let product of productsToRender; trackBy:this.trackByValue" [productId]="product"
          imageResolution="icon" class="images__image">
          </shop-product-image>
      </div>
    </ng-container>
  `,
  styleUrls: ['./order-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderTileComponent implements OnInit {

  order?: ShopOrder
  public productsToRender: string[] = [];
  public statusClasses: {[key:  string]: boolean} = {};
  public statusString: string = "";

  @Input("order")
  public set orderInput(order: ShopOrder | undefined){
    this.order = order;
    if(!this.order) return;
    this.productsToRender = Object.keys(this.order.products).slice(0, 4);
    this.statusString = getStatusString(this.order.status);
    this.statusClasses = this.getStatusClasses(this.order.status);
    this.cd.markForCheck();
  }

  public getStatusClasses(status: number): {[key: string]: boolean}{
    return {
      'info__status--unpaid': status === OrderStatuses.UNPAID,
      'info__status--paid': status === OrderStatuses.PAID,
      'info__status--cancelled': status === OrderStatuses.CANCELLED,
      'info__status--unknown': status === OrderStatuses.UNKNOWN
    }
  }
  
  public get orderInput(): ShopOrder | undefined{
    return this.order;
  }

  public trackByValue(index: number, value: string): string{
    return value;
  }

  public getProductCount(products: {[key: string]: any}){
    return Object.keys(products).length;
  }

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

}
