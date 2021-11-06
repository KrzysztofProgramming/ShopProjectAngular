import { Subscription } from 'rxjs';
import { ControlValueAccessor, FormGroup, FormBuilder, AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { ProductsFilters, productsTypes } from 'src/app/models/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
export class ProductsFiltersComponent implements OnInit, OnDestroy , ControlValueAccessor {

  @Output("onChange") onChangeEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output("startChanging") filtersStartChanging: EventEmitter<void> = new EventEmitter<void>();
  @Input() adminView: boolean = false;

  public filterOptions = productsTypes.map(item =>{return {label: item}});
  public formGroup: FormGroup = this.fb.group({
    searchPhrase: '',
    minPrice: 0,
    maxPrice: 0,
    minInStock: 0,
    maxInStock: 0,
    types: []
  })

  private subscriptions: Subscription[] = [];
  private onTouchedFn: any = () =>{}
  private onChangeFn: any = () =>{}

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.subscriptions.push(this.formGroup.valueChanges.subscribe(()=>this.filtersStartChanging.emit()));
    this.subscriptions.push(this.formGroup.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
    .subscribe(() =>{
      this.onChangeFn(this.getProductsFilters());
      this.onChangeEmitter.emit();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  public get searchControl(): AbstractControl{
    return this.formGroup.get("searchPhrase")!;
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

  public getProductsFilters(): ProductsFilters{
    let filter: ProductsFilters = {};
    filter.maxPrice = this.maxPriceControl.value;
    filter.minPrice = this.minPriceControl.value;
    filter.searchPhrase = this.searchControl.value ? this.searchControl.value.length === 0 ? undefined : this.searchControl.value : undefined
    filter.types = this.typesControl.value;
    filter.maxInStock = this.maxInStockControl.value;
    filter.minInStock = this.minInStockControl.value;
    return filter;
  }

  writeValue(obj: ProductsFilters): void {
    if(!obj) return;
    this.searchControl.setValue(obj.searchPhrase, {emitEvent: false});
    this.minPriceControl.setValue(obj.minPrice, {emitEvent: false});
    this.maxPriceControl.setValue(obj.maxPrice, {emitEvent: false});
    this.typesControl.setValue(obj.types, {emitEvent: false});
    this.maxInStockControl.setValue(obj.maxInStock, {emitEvent: false});
    this.minInStockControl.setValue(obj.minInStock, {emitEvent: false});
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
