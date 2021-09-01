import { DomSanitizer } from '@angular/platform-browser';
import { ProductsService } from 'src/app/services/products.service';
import { EMPTY_PRODUCT, ShopProduct } from './../../models/models';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'shop-product-tile',
  templateUrl: './product-tile.component.html',
  styleUrls: ['./product-tile.component.scss']
})
export class ProductTileComponent implements OnInit {

  private _product: ShopProduct = EMPTY_PRODUCT;
  public readonly EMPTY_IMAGE = "../../../assets/img/empty-image.png";
  public imageUrl = this.EMPTY_IMAGE;
  
  @ViewChild("description") descriptionContainer!: ElementRef<HTMLParagraphElement>

  constructor(private productsService: ProductsService, private sanitizer: DomSanitizer) { }

  @Input()
  set product(p: ShopProduct){
    this._product = p;
    if(this._product.id) {
      this.imageUrl = this.productsService.getProductImageUrl(this._product.id);
    }
    setTimeout(() => {
      this.addTextOverflowEllipsis();
    },0);
  
  }

  get product(): ShopProduct{
    return this._product;
  }

  addTextOverflowEllipsis(){
    const element = this.descriptionContainer.nativeElement;
    if(!element.textContent) return;
    console.log(element.scrollHeight > element.clientHeight);
    if(element.scrollHeight > element.clientHeight){
      element.textContent = element.textContent.replace(/\W*\s(\S)*$/, '...');
    }
  }

  ngOnInit(): void {

  }

  public onImageError(): void{
    this.imageUrl = this.EMPTY_IMAGE;
  }
}
