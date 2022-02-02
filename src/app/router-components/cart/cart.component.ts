import { ShoppingCartService } from './../../services/http/shopping-cart.service';
import { ShoppingCartWithDetails } from './../../models/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shop-cart',
  template: `
    <div class="all">
      <div *ngIf="!this.isCartEmpty" class="content">
        <!-- <shop-busy-overlay *ngIf="!this.cart"></shop-busy-overlay>
        <p *ngIf="this.isCartEmpty()">Twój koszyk jest pusty</p> -->
        <div class="editor-wrapper">
          <shop-cart-editor class="editor" (cartChange)="this.updateSummary($event)"></shop-cart-editor>
        </div>
  
        <div class="summary" #summary>
          <div class="summary__wrapper" [ngStyle]="{'top': this.summary!.offsetTop + 'px'}">
            <p class="summary__header">Podsumowanie:</p>
            <p class="summary__element">Łączna liczba produktów: <span class="summary__value">{{this.totalAmount}}</span></p>
            <p class="summary__element">Do zapłaty: <span class="summary__value"> {{ this.totalPrice | number: "1.2-2"}} zł</span></p>
            <button shopButton class="summary__button">Zapłać</button>
          </div>
        </div>
      </div>
      <div *ngIf="this.isCartEmpty" class="empty">
        <div class="empty__info-wrapper">
          <p class="empty__header">Twój koszyk jest pusty</p>
          <i class="pi pi-shopping-cart"></i>
          <p class="empty__subheader">Sprawdź naszą ofertę</p>
          <button shopButton class="empty__button" routerLink="../offert">Oferta</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  public isCartEmpty: boolean = true;
  public totalPrice: number = 0;
  public totalAmount: number = 0;
  private subscriptions: Subscription[] = [];

  @ViewChild("summary")
  public summary?: ElementRef<HTMLDivElement>;

  constructor(
    private cd: ChangeDetectorRef,
    private cartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cartService.cartEmptyChange.subscribe((value) => {
        this.isCartEmpty = value;
        this.cd.markForCheck();
      })
    );
  }

  public updateSummary(cart: ShoppingCartWithDetails){
    this.totalPrice = 0;
    this.totalAmount = 0;
    cart.items.forEach(product=>{
      this.totalPrice += product.amount * product.product.price;
      this.totalAmount += product.amount;
    })
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
