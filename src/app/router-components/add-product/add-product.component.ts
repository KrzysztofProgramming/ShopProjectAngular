import { ProductCreatorComponent } from '../../utils-components/products-utils/product-creator/product-creator.component';
import { ShopProductRequest, ShopProductRequestWithId } from './../../models/requests';
import { ToastMessageService } from './../../services/utils/toast-message.service';

import { catchError, finalize, switchMap, mapTo, tap } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';
import { ShopProduct, EMPTY_PRODUCT_REQUEST } from './../../models/models';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { ProductsService } from 'src/app/services/http/products.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription, Observable, of, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';


@Component({
  selector: 'shop-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit, OnDestroy {
  
  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private messageService: ToastMessageService,
    private activatedRoute: ActivatedRoute, public router: Router, private productsService: ProductsService,
    private sanitizer: DomSanitizer, private confirmationService: ConfirmationService,
    public location: Location) { }


  public readonly EMPTY_IMAGE: string = "../../../assets/img/empty-image.png";
  public imageUrl: string = this.EMPTY_IMAGE;
  public selectedFile?: Blob;
  public currentProductId?: number;
  public notRealod: boolean = false;
  public headerText = "Stwórz nowy produkt";
  public subscriptions: Subscription[] = [];
  public unchangedAfterSend: boolean = false; 
  public waitingForImage = false;
  public waitingForResponseMessage: string = "";
  public requestControl: FormControl = new FormControl(EMPTY_PRODUCT_REQUEST);
  public isUnDeletable?: boolean;

  @ViewChild("productCreator")
  public productCreator?: ProductCreatorComponent;

  get isWaitingForResponse(): boolean{
    return this.waitingForResponseMessage.length!==0;
  };

  getCurrentProduct(): ShopProductRequest{
    let product: ShopProductRequest = this.requestControl.value;
    product.id = this.currentProductId;
    return product;
  }

  writeValue(obj: ShopProductRequest): void {
    this.currentProductId = obj.id;
    this.requestControl.setValue(obj);
    this.cd.markForCheck();
  }

  ngOnInit(): void {
    this.subscriptions.push(this.requestControl.valueChanges.subscribe(()=>this.unchangedAfterSend = false));
    this.subscriptions.push(this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) =>{
      if(this.notRealod){
        this.notRealod = false;
        return;
      }
      
      if(this.productCreator)
        this.productCreator.resetControl();

      let id: string | null = paramMap.get("id"); 
      if(!id){
        this.navigateToNewProductUrl();
         return;
      }

      if(id.toLowerCase() === "new"){
          this.imageUrl = this.EMPTY_IMAGE;
          this.selectedFile = undefined;
          this.currentProductId = undefined;
          this.waitingForImage = false;
          this.requestControl.reset();
          this.headerText = "Stwórz nowy produkt";
          this.unchangedAfterSend = false;
          this.requestControl.reset();
          this.writeValue(EMPTY_PRODUCT_REQUEST);
          return;
      }
      
      if(isNaN(+id)) {
        this.navigateToNewProductUrl();
        return;
      }
      this.waitingForImage = true;
      this.productsService.getProduct(+id).subscribe(product=>{
        this.headerText = "Edytuj produkt";
        this.writeValue(this.toProductRequest(product));
        this.unchangedAfterSend = true;
        this.isUnDeletable = !product.isDeletable;
        this.loadImage();
        this.cd.markForCheck();
      }, _error =>{
        this.navigateToNewProductUrl();
      })
    }))
  }

  public toProductRequest(product: ShopProduct): ShopProductRequest{
    return {
      name: product.name,
      id: product.id,
      types: product.types.map(t=>t.id),
      price: product.price,
      inStock: product.inStock,
      description: product.description,
      authors: product.authors.map(a=>a.id)
    }
  }

  public loadImage(){
    if(!this.currentProductId) return;
    this.imageUrl = this.productsService.getProductOriginalImageUrl(this.currentProductId);
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  public navigateToNewProductUrl(){
    this.router.navigateByUrl("manageProduct/new");
  }

  public onFileChange(fileInput: HTMLInputElement){
    if(fileInput.files == null || fileInput.files.length === 0) return;
    this.unchangedAfterSend = false;
    let file: File = fileInput.files[0]
    if(!file.type.startsWith("image/")){
      this.messageService.showMessage({severity: "error", summary:"Zły plik", detail: "Zły format pliku"});
      return;
    }
    this.selectedFile = file.slice();
    fileInput.value = '';
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file)) as string;
  }

  public isCreatingNewProduct(){
    return !this.currentProductId || isNaN(this.currentProductId);
  }

  public onSubmit(){
    if(this.isCreatingNewProduct()){
      this.createNewProduct();
      return;
    }
    this.updateProduct();
  } 

  private resetResponseMessage(): void{
    this.waitingForResponseMessage = "";
    this.cd.markForCheck();
  }


  private doRequest(fn: ((((product: ShopProductRequest)=>Observable<ShopProduct>) |
    ((product: ShopProductRequestWithId)=>Observable<ShopProduct>)))){
    fn(this.getCurrentProduct() as ShopProductRequestWithId).pipe(
      catchError(productError=>{
        this.messageService.showMessage({severity: "error", summary: "Błąd", detail: "Operacja nie udana"});
        return throwError(productError);
      }),
      switchMap(product=>{
        if(!this.hasImage()){
          return this.productsService.deleteProductImage(product.id!).pipe(
            catchError(deleteFileError=>{
              this.messageService.showMessage({severity: "warn", summary: "Uwaga", detail: "Nie udało się usunąć obrazu"});
              this.navigateToProduct(product.id!.toString());
              this.loadImage();
              return throwError(deleteFileError);
            }),
            tap(_deleteFileSuccess=>{
              this.selectedFile = undefined;
              this.cd.markForCheck();
            }),
            mapTo(product)
          )
        }
        if(this.selectedFile == null){
          return of(product);
        }
        this.unchangedAfterSend = true;
        this.waitingForResponseMessage = "Dodawanie obrazu";
        this.cd.markForCheck();

        return this.sendFile(product.id!).pipe(
          catchError(fileError=>{
            this.messageService.showMessage({severity: "warn", summary: "Uwaga", detail: "Nie udało się dodać obrazu"});
            this.navigateToProduct(product.id!.toString());
            this.loadImage();
            return throwError(fileError);
          }),
          tap(_fileSuccess=>{
            this.selectedFile = undefined;
            this.imageUrl = this.productsService.getProductOriginalImageUrl(product.id!);
            this.cd.markForCheck();
          }),
          mapTo(product)
        )
      }),
      finalize(()=>this.resetResponseMessage())
    ).subscribe(product=>{
      this.showSuccessMessage();
      this.navigateToProduct(product.id!.toString());
    }, anyError =>{
    })
  }


  private createNewProduct(): void{
    this.waitingForResponseMessage = "Dodawanie produktu";
    this.doRequest(this.productsService.addProduct.bind(this.productsService));
  }

  private updateProduct(): void{
    this.waitingForResponseMessage = "Modyfikowanie produktu";
    this.doRequest(this.productsService.updateProduct.bind(this.productsService));
  }

  public onImageError(){
    this.resetFile();
  }

  private resetFile(){
    this.setImageUrlEmpty();
    this.selectedFile = undefined;
    this.waitingForImage = false;
    this.cd.markForCheck();
  }

  private setImageUrlEmpty(){
    this.imageUrl = this.EMPTY_IMAGE;
  }

  public onImageLoaded(){
    this.waitingForImage = false;
    this.cd.markForCheck();
  }

  private navigateToProduct(id: string){
    this.router.navigateByUrl(`manageProduct/${id!}`);
  }

  private sendFile(id: number): Observable<Object>{
     return this.productsService.uploadProductImage(id, this.selectedFile!)
  }

  private showSuccessMessage(): void{
    this.messageService.showMessage({severity: "success", summary: "Sukces", detail: "Operacja wykonana pomyślnie"});
  }

  public hasImage(): boolean{
    return this.imageUrl !== this.EMPTY_IMAGE;
  }

  public onImageRemove(): void{
    this.resetFile();
    this.unchangedAfterSend = false;
  }

  public onProductRemove(): void{
    this.confirmationService.confirm({
      header: "Potwierdź",
      message: "Czy na pewno chcesz usunąć ten produkt? Ta operacja jest nieodwracalna",
      accept: ()=>{
        if(this.currentProductId == null) return;
        this.productsService.deleteProduct(this.currentProductId).subscribe(val =>{
            this.router.navigate(['/products']);
            // this.location.back();
          }
        );
      }
    })
  }

  public archiveClicked(): void{

  }

}
