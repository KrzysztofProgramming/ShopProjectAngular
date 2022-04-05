import { ProductsService } from 'src/app/services/http/products.service';
import { ShopProduct } from 'src/app/models/models';
import { ProfileInfoService } from 'src/app/services/http/profile-info.service';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopOrder } from './../../../models/models';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile-order-detail',
  templateUrl: './profile-order-detail.component.html',
  styleUrls: ['./profile-order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileOrderDetailComponent implements OnInit, OnDestroy {

  public order?: ShopOrder;
  public waitingForResponse: boolean = true;
  private subscriptions: Subscription[] = [];
  public products: ShopProduct[] = [];

  constructor(private route: ActivatedRoute, private profileService: ProfileInfoService, private router: Router,
     private cd: ChangeDetectorRef, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(paramMap=>{
        this.waitingForResponse = true;
        this.cd.markForCheck();
        return this.profileService.getOrder(paramMap.get("id")!);
      }),
    ).subscribe(order=>{
      this.order = order;
      this.readOrderProducts(order);
      this.waitingForResponse = false;
      this.cd.markForCheck();
    }, error=>{
      this.navigateToNotFound();
    })
  }

  public readOrderProducts(order: ShopOrder){
    this.productsService.getProducts(Object.keys(order.products)).subscribe(products=>{
      this.products = products;
      this.cd.markForCheck();
    });
  }

  private navigateToNotFound(){
    this.router.navigate(['notFound'], {skipLocationChange: true});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public trackProductById(index: number, product: ShopProduct): string{
    return product.id;
  }

}
