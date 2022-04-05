import { DATE_FORMAT, OrdersStatusOption, ORDERS_STATUS_OPTIONS } from './../../models/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DEFAULT_PAGEABLE } from 'src/app/models/requests';
import { GetOrdersParams } from './../../models/requests';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, AbstractControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { OrderStatuses } from 'src/app/models/models';
import { DatePipe, formatDate } from '@angular/common';
import { format, parse } from 'date-format-parse';


@Component({
  selector: 'shop-orders-filters',
  template: `
    <form class="content" [formGroup]="this.formGroup">
      <p class="header">Filtry</p>
      <p class="subheader">Cena:</p>
      <div class="price-filter filter">
        <p-inputNumber formControlName = "minPrice" class="price-input filter__input"
         (onBlur)="this.onToucheFn()" placeholder="min" mode="currency" currency="PLN" locale="pl-PL"></p-inputNumber>
        <p class="filter__separator">-</p>
        <p-inputNumber class="price-input filter__input" (onBlur)="this.onToucheFn()"
        formControlName = "maxPrice" placeholder="max" mode="currency" currency="PLN" locale="pl-PL"></p-inputNumber>
      </div>
      <p class="subheader">Data złożenia:</p>
      <div class="date-filter filter">
        <p-calendar class="date-input filter__input" (onBlur)="this.onToucheFn()"
        formControlName = "minDate" placeholder="od"></p-calendar>
        <p class="filter__separator">-</p>
        <p-calendar class="date-inpu filter__input" (onBlur)="this.onToucheFn()"
        formControlName = "maxDate" placeholder="do"></p-calendar>
      </div>
      <p class="subheader">Status:</p>
      <p-dropdown class="dropdown" [options]="this.statusOptions" optionLabel="name" optionValue="code"
      formControlName="status"></p-dropdown>
    </form>
  `,
  styleUrls: ['./orders-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: OrdersFiltersComponent,
    multi: true
  }, DatePipe]
})
export class OrdersFiltersComponent implements OnInit, ControlValueAccessor, OnDestroy {

  public model: GetOrdersParams = DEFAULT_PAGEABLE;
  public readonly statusOptions: OrdersStatusOption[] = ORDERS_STATUS_OPTIONS;

  public formGroup = this.fb.group({
    maxPrice: [],
    minPrice: [],
    status: [],
    maxDate: [],
    minDate: []
  });
  public onChangeFn: any = ()=>{};
  public onToucheFn: any = ()=>{};
  private subscriptions: Subscription[] = [];
  @Output()
  modelStartChanging: EventEmitter<void> = new EventEmitter();


  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private datePipe: DatePipe) {
    
  }

  public get minPriceControl(): AbstractControl{
    return this.formGroup.get("minPrice")!;
  }

  public get maxPriceControl(): AbstractControl{
    return this.formGroup.get("maxPrice")!;
  }

  public get statusControl(): AbstractControl{
    return this.formGroup.get("status")!;
  }

  public get minDateControl(): AbstractControl{
    return this.formGroup.get("minDate")!;
  }

  public get maxDateControl(): AbstractControl{
    return this.formGroup.get("maxDate")!;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(newValue=>{
        this.modelStartChanging.emit(newValue);
      }),
      this.formGroup.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(()=>{
        this.callOnChange();
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  writeValue(obj: GetOrdersParams): void {
    if(!obj){
      this.formGroup.reset({}, {emitEvent: false});
      return;
    }
    let parsedMaxDate = obj.maxDate ? parse(obj.maxDate, DATE_FORMAT) : undefined;
    if(!this.isValidDate(parsedMaxDate)) parsedMaxDate = undefined;
    let parsedMinDate = obj.minDate ? parse(obj.minDate, DATE_FORMAT) : undefined;
    if(!this.isValidDate(parsedMinDate)) parsedMinDate = undefined;

    this.minDateControl.setValue(parsedMinDate, {emitEvent: false});
    this.maxDateControl.setValue(parsedMaxDate, {emitEvent: false});
    this.statusControl.setValue(obj.status, {emitEvent: false});
    this.minPriceControl.setValue(obj.minPrice, {emitEvent: false});
    this.maxPriceControl.setValue(obj.maxPrice, {emitEvent: false});
    this.cd.markForCheck();
  }

  private isValidDate(date: Date | undefined){
    return date instanceof Date && !isNaN(date.getTime());
  }

  public getModifiedModel(){
    let changedModel = Object.assign({}, this.model);
    changedModel = Object.assign(changedModel, this.formGroup.value);
    if(this.minDateControl.value) changedModel.minDate = format(this.minDateControl.value, DATE_FORMAT);
    if(this.maxDateControl.value) changedModel.maxDate = format(this.maxDateControl.value, DATE_FORMAT);
    return changedModel;
  }

  public callOnChange(){
    this.onChangeFn(this.getModifiedModel());
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
  }

}
