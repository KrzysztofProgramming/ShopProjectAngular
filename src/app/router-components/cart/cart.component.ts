import { ShoppingCartService } from './../../services/shopping-cart.service';
import { ShoppingCart } from './../../models/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shop-cart',
  template: `
    <h2 class="header"> Twój koszyk: </h2>
    <div class="container">
      <shop-busy-overlay *ngIf="!this.cart"></shop-busy-overlay>
      <p *ngIf="this.isCartEmpty()">Twój koszyk jest pusty</p>
      <shop-cart-editor class="editor" *ngIf="this.cart" [(ngModel)]="this.cart"></shop-cart-editor>
      <div class="other">some other content</div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  
  public cart?: ShoppingCart;
  private subscriptions: Subscription[] = [];

  constructor(private cartService: ShoppingCartService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cartService.refreshCart().subscribe();
    this.subscriptions.push(
      this.cartService.cartChanges.subscribe(newCart=>{
        this.cart = newCart;
        this.cd.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public isCartEmpty(){
    return this.cart && Object.keys(this.cart.items).length === 0;
  }

}
