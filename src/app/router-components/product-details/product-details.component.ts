import { ProductsService } from './../../services/products.service';
import { ShopProduct, ShopProductWithId } from './../../models/models';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private productsService: ProductsService,
     private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.paramMap.subscribe(paramMap =>{
        const id = paramMap.get("id");
        if(!id){
          return;
        }
        this.productsService.getProduct(id).subscribe(p =>{
          this.product = p;
          this.cd.markForCheck();
        });
      })
    )
  }

}
