import { ProductsService } from 'src/app/services/http/products.service';
import { ShopProduct } from '../../../models/models';
import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'shop-product-tile',
  templateUrl: './product-tile.component.html',
  styleUrls: ['./product-tile.component.scss']
})
export class ProductTileComponent implements OnInit {

  private _product?: ShopProduct;
  public readonly EMPTY_IMAGE = "../../../assets/img/empty-image.png";
  public imageUrl = this.EMPTY_IMAGE;
  public authorsNames: string = "";

  @ViewChild("description") descriptionContainer!: ElementRef<HTMLParagraphElement>
  // @Input() adminView: boolean = false;

  constructor(private productsService: ProductsService, private cd: ChangeDetectorRef) { }

  @Input()
  set product(p: ShopProduct | undefined){
    if(!p) return;
    this._product = p;
    this.imageUrl = this.productsService.getProductSmallImageUrl(this._product.id);
    this.authorsNames = p.authors.map(a=>a.name).join(", ");
    this.cd.markForCheck();
  }

  get product(): ShopProduct | undefined{
    return this._product;
  }

  ngOnInit(): void {

  }

  public onImageError(): void{
    this.imageUrl = this.EMPTY_IMAGE;
  }

}
