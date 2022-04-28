import { TypeResponse } from './../../../models/responses';
import { SimpleAuthor } from './../../../models/models';
import { Subscription } from 'rxjs';
import { ShopProductRequest } from '../../../models/requests';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';
import { notBlankValidator, notEmptyListValidator } from 'src/app/models/shop-validators';
import { AuthorsSelectComponent } from '../../authors-utils/authors-select/authors-select.component';
import { TypesSelectComponent } from '../../multi-selects/types-select/types-select.component';
import { EMPTY_PRODUCT_REQUEST } from 'src/app/models/models';

@Component({
  selector: 'shop-product-creator',
  templateUrl: './product-creator.component.html',
  styleUrls: ['./product-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProductCreatorComponent,
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ProductCreatorComponent,
      multi: true
    }
  ]
})
export class ProductCreatorComponent implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  

  public authorCreatorVisibility: boolean = false;
  public typeCreatorVisibility: boolean = false;
  public model: ShopProductRequest = EMPTY_PRODUCT_REQUEST;
  public onChangeFn: (request: ShopProductRequest)=>void = ()=>{}
  public onToucheFn: ()=> void = ()=>{};
  
  @Output()
  public onSubmit: EventEmitter<void> = new EventEmitter();

  @ViewChild("authorsSelect")
  private authorsSelect?: AuthorsSelectComponent;

  @ViewChild("typesSelect")
  private typesSelect?: TypesSelectComponent;
  
  private subscriptions: Subscription[] = [];

  public formGroup: FormGroup = this.fb.group({
    name: ['', [Validators.required, notBlankValidator]],
    price: [0, [Validators.required, Validators.min(0)]],
    categories: [[], notEmptyListValidator],
    description: ['', [Validators.required, notBlankValidator]],
    inStock: [0, [Validators.required, Validators.min(0)]],
    authors: [[], notEmptyListValidator]
  })

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.subscriptions.push(this.formGroup.valueChanges.subscribe(()=>{this.callOnChange();}))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
  
  public resetControl(){
    this.formGroup.reset();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.formGroup.valid ? null : {invalid: true};
  }

  get currentProduct(): ShopProductRequest{
    return {
      name: this.nameControl.value.trim(),
      price: this.priceControl.value,
      description: this.descriptionControl.value.trim(),
      types: this.categoriesControl.value,
      inStock: this.inStockControl.value,
      authors: this.authorsControl.value
    }
  }

  public callOnChange(){
    this.model.name = this.nameControl.value.trim();
    this.model.price = this.priceControl.value;
    this.model.description = this.descriptionControl.value.trim();
    this.model.types = this.categoriesControl.value;
    this.model.inStock = this.inStockControl.value;
    this.model.authors = this.authorsControl.value;
    this.onChangeFn(this.model);
  }

  public callOnToche(){
    this.onToucheFn();
  }

  writeValue(obj: ShopProductRequest): void {
    this.model = Object.assign({}, obj);
    this.nameControl.setValue(this.model.name, {emitEvent: false});
    this.priceControl.setValue(this.model.price, {emitEvent: false});
    this.descriptionControl.setValue(this.model.description, {emitEvent: false});
    this.categoriesControl.setValue(this.model.types, {emitEvent: false});
    this.inStockControl.setValue(this.model.inStock, {emitEvent: false})
    this.authorsControl.setValue(this.model.authors, {emitEvent: false});
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
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

  public refreshAuthorsSelect(){
    this.authorsSelect?.refreshAuthors();
  }

  public refreshTypesSelect(){
    this.typesSelect?.refreshTypes();
  }

  public showAuthorCreator(){
    this.authorCreatorVisibility = true;
    this.cd.markForCheck();
  }

  public showTypeCreator(){
    this.typeCreatorVisibility = true;
    this.cd.markForCheck();
  }
}
