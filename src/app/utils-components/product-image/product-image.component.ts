import { ProductsService } from 'src/app/services/products.service';
import { Component, Input, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'shop-product-image',
  template: `
    <shop-busy-overlay *ngIf = "this.waitingForImage"></shop-busy-overlay>
    <img class="image" [src] = "this.imageUrl" (error)="this.onImageError()" (load) = "this.onImageLoaded()">
  `,
  styleUrls: ['./product-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductImageComponent implements OnInit {

  public readonly EMPTY_IMAGE = "../../../assets/img/empty-image.png";
  public waitingForImage: boolean = false;
  public _productId = "";
  public imageUrl = this.EMPTY_IMAGE;
  @Input() imageResolution: "small" | "original" = "original";
  @Output() imageLoaded: EventEmitter<void> = new EventEmitter<void>();


  @Input()
  set productId(value: string){
    this._productId = value;
    if(this.imageResolution === "original"){
      this.imageUrl = this.productsService.getProductOriginalImageUrl(this._productId);
    }
    else{
      this.imageUrl = this.productsService.getProductSmallImageUrl(this._productId);
    }
    this.waitingForImage = true;
    this.cd.markForCheck();
  }
  get productId(): string{
    return this._productId;
  }

  public onImageError(){
    this.imageUrl = this.EMPTY_IMAGE;
    this.waitingForImage = false;
    this.cd.markForCheck();
  }  

  public onImageLoaded(){
    this.waitingForImage = false;
    this.cd.markForCheck();
    this.imageLoaded.emit();
  }

  constructor(private cd: ChangeDetectorRef, private productsService: ProductsService) { }

  ngOnInit(): void {
  }

}