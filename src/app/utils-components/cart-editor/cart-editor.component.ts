import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ShoppingCartService } from '../../services/http/shopping-cart.service';
import { AuthService } from './../../services/auth/auth.service';
import { EMPTY_DETAILS_CART, ShoppingCartWithDetails, ShoppingCartDetail } from './../../models/models';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ElementRef, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: "shop-cart-editor-element",
  template: `
    <div class="container" *ngIf="this.item">
      <div class="link" (click)="this.navigateToProduct()">
        <shop-product-image class="link__image" [productId]="this.item.product.id" imageResolution="icon"></shop-product-image>
        <p class="link__name">{{this.item.product.name}}</p>
      </div>
      <div class="modifiers">
        <p class="modifiers__price modifiers__element">{{this.item.product.price * this.item.amount | number: '1.2-2'}}  zł</p>
        <div class="modifiers__delete modifiers__element" (click) = "this.itemRemove.emit()">
          <i class="pi pi-trash" title="usuń z koszyka"></i>
        </div>
        <p-inputNumber class="modifiers__amount modifiers__element" [useGrouping]="false" [max]="this.maxCountModel"
          [min]="1" [step]="1" [showButtons]="true"
          [formControl]="this.amountControl">
        </p-inputNumber>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['cart-editor-element.component.scss']
})
export class CartEditorElementComponent implements OnInit, OnDestroy{

  @Output() itemAmountChange: EventEmitter<number> = new EventEmitter();
  @Output() itemRemove: EventEmitter<void> = new EventEmitter();
  item?: ShoppingCartDetail;

  @Input("item")
  set itemInput(item: ShoppingCartDetail | undefined){
    if(!item) return;
    this.item = item;
    this.amountControl.setValue(this.item?.amount, {emitEvent: false});
    this.calcMaxCountModel();
  }
  get itemInput(): ShoppingCartDetail | undefined{
    return this.item;
  }

  public amountControl = new FormControl(1);
  public subscriptions: Subscription[] = [];
  public maxCountModel: number = Number.MAX_SAFE_INTEGER;
  public areReserved: boolean = false;
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
    this.subscriptions.push(
      this.amountControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ).subscribe(value=>this.itemAmountChange.emit(value))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  private calcMaxCountModel(){
    if(!this.item) return; 
    this.maxCountModel = this.item.product.inStock;
  }

  public navigateToProduct(){
    this.router.navigateByUrl(`product/${this.item?.product.id}`);
  }

}


@Component({
  selector: 'shop-cart-editor',
  template: `
    <!-- <div class="header">
      Produkty w koszyku:
    </div> -->
    <div class="content">
      <div class="top-bar" >
        <div class="top-bar__remove-all" *ngIf = "this.cart.items.length !== 0"  (click) = "this.openDeleteDialog()">
          <i class="pi pi-times"></i>
          <p>Usuń wszystko</p>
        </div>
      </div>
      <ng-container  *ngFor="let element of cart.items; let i=index; trackBy: trackByItem">
        <shop-cart-editor-element class="element" [item]="cart.items[i]" (itemRemove) = "this.onItemRemove(i)"
        (itemAmountChange)="this.onItemChange(i, $event)"></shop-cart-editor-element>
      </ng-container>
    </div>
    <shop-busy-overlay *ngIf = "this.waitingForResponse"></shop-busy-overlay>
    <shop-dialog class="dialog" acceptPhrase="Tak" cancelPhrase="Anuluj" (accept)="this.deleteCart()"
    [(visibility)] = "deleteDialogVisibility" dialogTitle="Potwierdź">
      <p class="dialog__text">Czy na pewno chcesz usunąć wszystkie elementy z koszyka?
        Ta operacja jest nieodwracalna
      </p>
    </shop-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./cart-editor.component.scss']
})
export class CartEditorComponent implements OnInit, OnDestroy {

  public cart: ShoppingCartWithDetails = EMPTY_DETAILS_CART;
  public deleteDialogVisibility: boolean = false;


  @Output("cartChange") cartChange: EventEmitter<ShoppingCartWithDetails> = new EventEmitter();
  
  public waitingForResponse: boolean = true;
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef, private cartService: ShoppingCartService) { }

  onItemRemove(index: number){
    this.waitingForResponse = true;
    this.cartService.deleteProductFromCart(this.cart.items[index].product.id).subscribe();
    this.cd.markForCheck();
  }
  
  public openDeleteDialog(){
    this.deleteDialogVisibility = true;
    this.cd.markForCheck();
  }

  onItemChange(index: number, amount: number){
    // console.log("onItemChange");
    this.waitingForResponse = true;
    this.cartService.setProductInCart({
      amount: amount,
      productId: this.cart.items[index].product.id})
      .subscribe();
    this.cd.markForCheck();
  }

  deleteCart(){
    this.deleteDialogVisibility = false;
    this.cd.markForCheck();
    this.cartService.deleteCart().subscribe();
  }

  trackByItem(index: number, item: ShoppingCartDetail){
    return item.amount + item.product.id;
  }

  ngOnInit(): void {
    this.subscriptions.push(
        this.cartService.cartChanges.pipe(
        switchMap(this.cartService.getDetails.bind(this.cartService)),
      ).subscribe(value=>{
        this.cart = value;
        this.cartChange.emit(this.cart);
        this.waitingForResponse = false;
        this.cd.markForCheck();
      },()=>{
        this.waitingForResponse = false;
        this.cd.markForCheck();
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
}
