import { AuthorsSelectComponent } from './../../utils-components/authors-select/authors-select.component';
import { AuthorCreatorComponent } from './../../utils-components/author-creator/author-creator.component';
import { ToastMessageService } from './../../services/utils/toast-message.service';

import { catchError, finalize, switchMap, mapTo, tap } from 'rxjs/operators';
import { ConfirmationService } from 'primeng/api';
import { ShopProduct, EMPTY_PRODUCT, ShopProductWithId, SimpleAuthor } from './../../models/models';
import { notEmptyListValidator } from './../../models/shop-validators';
import { AbstractControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AddProductComponent,
    multi: true
  }, ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit, ControlValueAccessor, OnDestroy {
  
  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private messageService: ToastMessageService,
    private activatedRoute: ActivatedRoute, private router: Router, private productsService: ProductsService,
    private sanitizer: DomSanitizer, private confirmationService: ConfirmationService,
    public location: Location) { }


  writeValue(obj: ShopProduct): void {
    this.currentProductId = obj.id;
    this.nameControl.setValue(obj.name);
    this.priceControl.setValue(obj.price);
    this.descriptionControl.setValue(obj.description);
    this.categoriesControl.setValue(obj.types);
    this.inStockControl.setValue(obj.inStock)
    this.authorsControl.setValue(obj.authors);
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeFunction = fn;
  }

  registerOnTouched(fn: any): void {
    //ignore
  }

  public readonly EMPTY_IMAGE: string = "../../../assets/img/empty-image.png";
  public imageUrl: string = this.EMPTY_IMAGE;
  public selectedFile?: Blob;
  public currentProductId?: string | null;
  private onChangeFunction: any = () => {};
  public notRealod: boolean = false;
  public headerText = "Stwórz nowy produkt";
  public subscriptions: Subscription[] = [];
  public unchangedAfterSend: boolean = false; 
  public waitingForImage = false;
  public waitingForResponseMessage: string = "";
  public authorCreatorVisibility: boolean = false;
  @ViewChild("authorsSelect")
  private authorsSelect?: AuthorsSelectComponent;
 
  testModel: SimpleAuthor[] = [];


  public formGroup: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    categories: [[], notEmptyListValidator],
    description: ['', Validators.required],
    inStock: [0, [Validators.required, Validators.min(0)]],
    authors: [[], notEmptyListValidator]
  })
  

  get isWaitingForResponse(): boolean{
    return this.waitingForResponseMessage.length!==0;
  };

  get currentProduct(): ShopProduct{
    return {
      id: this.currentProductId,
      name: this.nameControl.value,
      price: this.priceControl.value,
      description: this.descriptionControl.value,
      types: this.categoriesControl.value,
      inStock: this.inStockControl.value,
      authors: this.authorsControl.value
    }
  }

  get authorsControl(): AbstractControl{
    return this.formGroup.get("authors")!;
  }

  get inStockControl(): AbstractControl{
    return this.formGroup.get("inStock")!;
  }

  get categoriesControl(): AbstractControl{
    return this.formGroup.get("categories")!
  }

  get nameControl(): AbstractControl{
    return this.formGroup.get("name")!
  }

  get priceControl(): AbstractControl{
    return this.formGroup.get("price")!
  }

  get descriptionControl(): AbstractControl{
    return this.formGroup.get("description")!;
  }

  ngOnInit(): void {
    this.subscriptions.push(this.formGroup.valueChanges.subscribe(()=>this.unchangedAfterSend = false));
    this.subscriptions.push(this.formGroup.valueChanges.subscribe(()=>this.onChangeFunction(this.currentProduct)));
    this.subscriptions.push(this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) =>{
      if(this.notRealod){
        this.notRealod = false;
        return;
      }

      let id = paramMap.get("id"); 
      if(id==null || id.length === 0){
        this.navigateToNewProductUrl();
         return;
      }

      if(id.toLowerCase() === "new"){
          this.imageUrl = this.EMPTY_IMAGE;
          this.selectedFile = undefined;
          this.currentProductId = null;
          this.formGroup.reset();
          this.headerText = "Stwórz nowy produkt";
          this.unchangedAfterSend = false;
          this.writeValue(EMPTY_PRODUCT);
          return;
      }

      this.waitingForImage = true;
      this.productsService.getProduct(id).subscribe(product=>{
        this.headerText = "Edytuj produkt";
        this.writeValue(product);
        this.unchangedAfterSend = true;
        this.loadImage();
        this.cd.markForCheck();
      }, _error =>{
        this.navigateToNewProductUrl();
      })
    }))
  }

  public refreshAuthorsSelect(){
    this.authorsSelect?.refreshAuthors();
  }

  public showAuthorCreator(){
    console.log(this.authorCreatorVisibility);
    this.authorCreatorVisibility = true;
    this.cd.markForCheck();
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
    return this.currentProductId == null || this.currentProductId.length === 0 ;
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


  private doRequest(fn: ((product: ShopProduct)=>Observable<ShopProduct>) | ((product: ShopProductWithId)=>Observable<ShopProduct>)){
    fn(this.currentProduct as ShopProductWithId).pipe(
      catchError(productError=>{
        this.messageService.showMessage({severity: "error", summary: "Błąd", detail: "Operacja nie udana"});
        return throwError(productError);
      }),
      switchMap(product=>{
        if(!this.hasImage()){
          return this.productsService.deleteProductImage(product.id!).pipe(
            catchError(deleteFileError=>{
              this.messageService.showMessage({severity: "warn", summary: "Uwaga", detail: "Nie udało się usunąć obrazu"});
              this.navigateToProduct(product.id!);
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
            this.navigateToProduct(product.id!);
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
      this.navigateToProduct(product.id!);
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
    this.cd.markForCheck();
  }

  private setImageUrlEmpty(){
    this.imageUrl = this.EMPTY_IMAGE;
  }

  public onImageLoaded(){
    this.waitingForImage = false;
  }

  private navigateToProduct(id: string){
    this.router.navigateByUrl(`manageProduct/${id!}`);
  }

  private sendFile(id: string): Observable<Object>{
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
            this.router.navigateByUrl("/");
          }
        );
      }
    })
  }

}
