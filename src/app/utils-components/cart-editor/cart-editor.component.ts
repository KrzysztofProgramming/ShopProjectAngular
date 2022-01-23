import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from './../../services/auth/auth.service';
import { EMPTY_CART, ShoppingCart, ShopProduct } from './../../models/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/http/products.service';
import { Router } from '@angular/router';

export interface CartEditorElementModel{
  product: ShopProduct;
  amount: number
}


@Component({
  selector: "shop-cart-editor-element",
  template: `
    <div class="container" *ngIf="this.model">
      <div class="link" (click)="this.navigateToProduct()">
        <shop-product-image class="link__image" [productId]="this.model.product.id" imageResolution="small"></shop-product-image>
        <p class="link__name">{{this.model.product.name}}</p>
      </div>
      <div class="modifiers">
        <p class="modifiers__price modifiers__element">{{this.model.product.price * this.model.amount}} zł</p>
        <div class="modifiers__delete modifiers__element">
          <i class="pi pi-trash" title="usuń z koszyka"></i>
        </div>
        <p-inputNumber class="modifiers__amount modifiers__element" [useGrouping]="false" [max]="this.maxCountModel"
          [min]="1" [step]="1" [showButtons]="true"
          incrementButtonClass="p-button-secondary" decrementButtonClass="p-button-secondary"
          [formControl]="this.amountControl">
        </p-inputNumber>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['cart-editor-element.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CartEditorElementComponent,
    multi: true
  }],
})
export class CartEditorElementComponent implements ControlValueAccessor, OnInit{
  public amountControl = new FormControl(1);
  public subscriptions: Subscription[] = [];
  public model?: CartEditorElementModel;
  public maxCountModel: number = Number.MAX_SAFE_INTEGER;
  public areReserved: boolean = false;
  private onChangeFn: any = ()=>{};
  private onTouchedFn: any = ()=>{};
  private containerRef!: HTMLElement;
  private readonly COLLAPSE_WIDTH: number = 500;
  public isCollapsed: boolean = false;


  constructor(private cd: ChangeDetectorRef, private authService: AuthService, private router: Router, private ref: ElementRef) {}

  @HostListener("window:resize", ["$event"])
  private onResize(event: Event){
    this.isCollapsed = this.COLLAPSE_WIDTH >= this.containerRef.clientWidth;
    console.log(this.isCollapsed);
  }

  ngOnInit(): void {
    this.containerRef = this.ref.nativeElement;
  }

  writeValue(obj: CartEditorElementModel): void {
    if(!obj) return;
    this.model = obj;
    this.amountControl.setValue(obj.amount);
    this.calcMaxCountModel();
    this.cd.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  private calcMaxCountModel(){
    if(!this.model) return; 
    this.maxCountModel = this.authService.isLogin() ? this.model.amount + this.model.product.inStock : this.model.product.inStock;
  }

  public navigateToProduct(){
    this.router.navigateByUrl(`product/${this.model?.product.id}`);
  }

}


@Component({
  selector: 'shop-cart-editor',
  template: `
    <div class="content">
      <ng-container  *ngFor="let element of elements; let i=index">
        <shop-cart-editor-element class="element" [(ngModel)]="elements[i]"></shop-cart-editor-element>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cart-editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CartEditorComponent,
    multi: true
  }],
})
export class CartEditorComponent implements OnInit, ControlValueAccessor {

  public cart :ShoppingCart = EMPTY_CART;
  public lastUpdateRequest?: Subscription;
  
  public elements: CartEditorElementModel[] = [];

  private onChangeFn: any = ()=>{};
  private onTouchedFn: any = ()=>{};

  constructor(private cd: ChangeDetectorRef, private productsService: ProductsService) { }

  writeValue(cart: ShoppingCart): void {
    if(!cart) return;
    if(this.lastUpdateRequest)
      this.lastUpdateRequest.unsubscribe();
    this.lastUpdateRequest = this.productsService.getProducts(Object.keys(cart.items)).subscribe(products=>{
      this.elements = products.map(product=>{
        return {"product": product, amount: cart.items[product.id]};
      })
      this.cart = cart;
      this.cd.markForCheck();
    })
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  ngOnInit(): void {
  }

}
