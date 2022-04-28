import { ShoppingCartService } from '../../services/http/shopping-cart.service';
import { ProductsService } from '../../services/http/products.service';
import { ShopProduct } from './../../models/models';
import { Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastMessageService } from 'src/app/services/utils/toast-message.service';
import { finalize, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'shop-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  public selectedCount: number = 1;
  public product?: ShopProduct;
  public waitingForResponse: boolean = false;
  public maxToSelect: number = 0;
  public inCartAmount: number = 0;
  public authorsString: string = ""
  public typesString: string = "";

  constructor(private activatedRoute: ActivatedRoute, private productsService: ProductsService,
     private cd: ChangeDetectorRef, private cartService: ShoppingCartService, private messageService: ToastMessageService,) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.paramMap.subscribe(paramMap =>{
        const id = +(paramMap.get("id") || "elo");
        if(isNaN(id)){
          return;
        }
        this.refreshProduct(id);
      }),
      this.cartService.cartChanges.subscribe(this.onCartChange.bind(this))
    );
  }

  public onCartChange(){
    if(!this.product) return;
    this.inCartAmount = this.cartService.currentCart.items[this.product.id] || 0
    this.maxToSelect = Math.max(0, this.product.inStock - this.inCartAmount);
    this.selectedCount = Math.min(this.maxToSelect, this.selectedCount);
    this.cd.markForCheck();
  }

  public addToCart(){
    if(!this.product) return;
    this.waitingForResponse = true;
    this.cd.markForCheck();
    this.cartService.addProductToCart({productId: this.product.id, amount: this.selectedCount}).pipe(
      mergeMap(()=>{return this.refreshProductObservable();}),
      finalize(()=>{
        this.waitingForResponse = false;
        this.cd.markForCheck();
      })
    ).subscribe(()=>{
      this.messageService.showMessage({severity: "success", summary: "Sukces", detail: "Produkt dodany do koszyka", key: 'br'});
    }, error=>{
      this.messageService.showMessage({severity: "error", summary: "Niepowodzenie", detail: error.error.info ? error.error.info
       : "Produkt nie został dodany do koszyka", key: 'br'});
    });
  }

  public refreshProduct(id?: number){
    this.refreshProductObservable(id).subscribe();
  }

  public refreshProductObservable(id?: number): Observable<ShopProduct | null>{
    if(id){
      return this.productsService.getProduct(id).pipe(
        tap(p =>{
          this.product = p;
          if(this.product.inStock <= 0){
            this.selectedCount = 0;
          }
          this.authorsString = this.product.authors.map(author=>author.name).join(", ");
          this.typesString = this.product.types.map(type=>type.name).join(", ");
          this.onCartChange();
          this.cd.markForCheck();
        })
      );
    }

    if(this.product){
      return this.refreshProductObservable(this.product.id);
    }

    return of(null);
  }
  
}
