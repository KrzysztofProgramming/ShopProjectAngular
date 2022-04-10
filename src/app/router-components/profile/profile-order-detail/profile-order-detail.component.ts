import { ProductsService } from 'src/app/services/http/products.service';
import { getStatusString, OrderStatuses, ShopProduct } from 'src/app/models/models';
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
  public totalPrice: number = 0;
  public totalAmount: number = 0;
  public formattedZipCode: string = "";
  public statusString: string = "";
  public statusClasses: {[key: string]: boolean} = {};

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
      this.totalAmount = Object.values(this.order.products).reduce((val1, val2)=>val1 + val2);
      const zipCode = this.order.info.address.zipCode.toString();
      this.statusString = getStatusString(this.order.status);
      this.statusClasses = this.getStatusClasses(this.order.status);
      this.formattedZipCode = zipCode.substring(0,2) + "-" + zipCode.substring(2);
      this.readOrderProducts(order);
      this.waitingForResponse = false;
      this.cd.markForCheck();
    }, error=>{
      this.navigateToNotFound();
    })
  }

  public getStatusClasses(status: number): {[key: string]: boolean}{
    return {
      'informations__status--unpaid': status === OrderStatuses.UNPAID,
      'informations__status--paid': status === OrderStatuses.PAID,
      'informations__status--cancelled': status === OrderStatuses.CANCELLED,
      'informations__status--unknown': status === OrderStatuses.UNKNOWN
    }
  }

  public isUnpaid(): boolean{
    return this.order!.status === OrderStatuses.UNPAID;
  }

  public readOrderProducts(order: ShopOrder){
    this.productsService.getProducts(Object.keys(order.products)).subscribe(products=>{
      this.products = products;
      this.totalPrice = this.calcTotalPrice();
      this.cd.markForCheck();
    });
  }

  private calcTotalPrice(): number{
    let price = 0;
    this.products.forEach(product=>{
      price += product.price * this.order!.products[product.id];
    })
    return price;
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

  public getItemCount(item: ShopProduct): number{
    return this.order!.products[item.id];
  }

}
