import { Subscription } from 'rxjs';
import { ControlValueAccessor, FormGroup, FormBuilder, AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


export interface ProductsFiltersModel{
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  authorsNames?: string[];
  minInStock?: number;
  maxInStock?: number;
}


@Component({
  selector: 'shop-products-filters',
  templateUrl: './products-filters.component.html',
  styleUrls: ['./products-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ProductsFiltersComponent,
    multi: true
  }],
})
export class ProductsFiltersComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Output("startChanging") filtersStartChanging: EventEmitter<void> = new EventEmitter<void>();
  @Input() showHeader: boolean = true;
  @Input() adminView: boolean = false;
  @Input() selectsType: 'dropdown' | 'accordion' = 'dropdown';
  @Input() debounceTime: boolean = true;
  
  private model: ProductsFiltersModel = {};
  //public filterOptions = productsTypes.map(item =>{return {label: item}});
  public formGroup: FormGroup = this.fb.group({
    minPrice: 0,
    maxPrice: 0,
    minInStock: 0,
    maxInStock: 0,
    types: [],
    authors: [],
  })

  private subscriptions: Subscription[] = [];
  private onTouchedFn: any = () =>{}
  private onChangeFn: any = () =>{}
  public authorsExpandedModel: boolean = false;
  public typesExpandedModel: boolean = false;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    if(this.debounceTime){
      this.subscriptions.push(this.formGroup.valueChanges.subscribe(()=>this.filtersStartChanging.emit()));
      this.subscriptions.push(this.formGroup.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() =>{
        this.onChangeFn(this.getProductsFilters());
      }));
    }
    else{
      this.subscriptions.push(this.formGroup.valueChanges.subscribe(()=>this.onChangeFn(this.getProductsFilters())));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  public collapseAllExpansions(){
    this.typesExpandedModel = false;
    this.authorsExpandedModel = false;
    this.cd.markForCheck();
  }

  public get minInStockControl(): AbstractControl{
    return this.formGroup.get("minInStock")!;
  }

  public get maxInStockControl(): AbstractControl{
    return this.formGroup.get("maxInStock")!;
  }

  public get minPriceControl(): AbstractControl{
    return this.formGroup.get("minPrice")!;
  }

  public get maxPriceControl(): AbstractControl{
    return this.formGroup.get("maxPrice")!;
  }

  public get typesControl(): AbstractControl{
    return this.formGroup.get("types")!;
  }

  public get authorsControl(): AbstractControl{
    return this.formGroup.get("authors")!;
  }

  public getProductsFilters(): ProductsFiltersModel{
    this.model.maxPrice = this.maxPriceControl.value;
    this.model.minPrice = this.minPriceControl.value;
    this.model.types = this.typesControl.value;
    this.model.maxInStock = this.maxInStockControl.value;
    this.model.minInStock = this.minInStockControl.value;
    this.model.authorsNames = this.authorsControl.value;
    return this.model;
  }

  writeValue(obj: ProductsFiltersModel): void {
    if(!obj){
      this.formGroup.reset({}, {emitEvent: false});
      return;
    };
    this.model = obj;
    this.minPriceControl.setValue(obj.minPrice, {emitEvent: false});
    this.maxPriceControl.setValue(obj.maxPrice, {emitEvent: false});
    this.typesControl.setValue(obj.types, {emitEvent: false});
    this.maxInStockControl.setValue(obj.maxInStock, {emitEvent: false});
    this.minInStockControl.setValue(obj.minInStock, {emitEvent: false});
    this.authorsControl.setValue(obj.authorsNames, {emitEvent: false});
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public triggerOnTouched(){
    this.onTouchedFn();
  }

}
