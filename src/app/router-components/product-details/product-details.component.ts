import { ShoppingCartService } from './../../services/http/shopping-cart.service';
import { ProductsService } from './../../services/http/products.service';
import { ShopProduct, ShopProductWithId, EMPTY_PRODUCT } from './../../models/models';
import { Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastMessageService } from 'src/app/services/utils/toast-message.service';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'shop-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  public selectedCount: number = 1;
  public product?: ShopProductWithId;
  public waitingForResponse: boolean = false;

  constructor(private activatedRoute: ActivatedRoute, private productsService: ProductsService,
     private cd: ChangeDetectorRef, private cartService: ShoppingCartService, private messageService: ToastMessageService ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.paramMap.subscribe(paramMap =>{
        const id = paramMap.get("id");
        if(!id){
          return;
        }
        this.refreshProduct(id);
        // this.refreshProductObservable(id).subscribe();
      })
    )
  }

  public addToCart(){
    if(!this.product) return;
    this.waitingForResponse = true;
    this.cd.markForCheck();
    this.cartService.addProductToCart({productId: this.product.id, amount: this.selectedCount}).pipe(
      mergeMap(()=>{return this.refreshProductObservable();})
    ).subscribe(()=>{
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "success", summary: "Sukces", detail: "Produkt dodany do koszyka"});
      this.cd.markForCheck();
      
      
    }, error=>{
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "error", summary: "Niepowodzenie", detail: error.error ? error.error.info
       : "Produkt dodany do koszyka"});
      this.cd.markForCheck();
    });
  }

  public refreshProduct(id?: string){
    this.refreshProductObservable(id).subscribe(val=>{val});
  }

  public refreshProductObservable(id?: string): Observable<ShopProduct>{
    if(id){
      return this.productsService.getProduct(id).pipe(
        tap(p =>{
          this.product = p;
          if(this.product.inStock <= 0){
            this.selectedCount = 0;
          }
          this.cd.markForCheck();
        })
      );
    }

    if(this.product){
      return this.refreshProductObservable(this.product.id);
    }
    return of(EMPTY_PRODUCT);
  }

  
}
