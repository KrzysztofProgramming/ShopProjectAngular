import { OrdersStatusOption, OrderStatuses, ORDERS_STATUS_OPTIONS } from './../../models/models';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { GetOrdersParams, DEFAULT_ORDERS_PARAMS } from './../../models/requests';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shop-orders-filters-dialog',
  templateUrl: './orders-filters-dialog.component.html',
  styleUrls: ['./orders-filters-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: OrdersFiltersDialogComponent,
    multi: true
  }]
})
export class OrdersFiltersDialogComponent implements OnInit, ControlValueAccessor {


  _visibility: boolean = false;

  @Output()
  visibilityChange: EventEmitter<boolean> = new EventEmitter();
  
  public minDate?: Date;
  public maxDate?: Date;
  public readonly statusOptions: OrdersStatusOption[] = ORDERS_STATUS_OPTIONS;

  public get visibility(): boolean{
    return this._visibility;
  }

  public set visibility(value: boolean){
    this._visibility = value;
    this.onVisibilityChange(value);
  }

  @Input("visibility")
  public get visibilityInput():boolean{
    return this._visibility;
  }
  
  public set visibilityInput(value: boolean){
    this._visibility = value;
  }

  private onChangeFn: any = ()=>{};
  private onToucheFn: any = ()=>{};
  public model: GetOrdersParams = DEFAULT_ORDERS_PARAMS;
  public unchangedModel: GetOrdersParams = DEFAULT_ORDERS_PARAMS;

  constructor(private cd: ChangeDetectorRef) { }

  writeValue(obj: any): void {
    this.model = Object.assign({}, DEFAULT_ORDERS_PARAMS);
    this.model = Object.assign(this.model, obj);
    this.unchangedModel = Object.assign({}, this.model);

    let maxDate = this.model.maxDate ? new Date(Date.parse(this.model.maxDate)) : undefined;
    let minDate = this.model.minDate ? new Date(Date.parse(this.model.minDate)) : undefined;
    if(this.isValidDate(minDate)) this.minDate = minDate!;
    else this.minDate = undefined;
    if(this.isValidDate(maxDate)) this.maxDate = maxDate!;
    else this.maxDate = undefined;

    this.cd.markForCheck();
  }

  private isValidDate(date: Date | undefined): boolean{
    return date instanceof Date && !isNaN(date.getTime());
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
  }

  ngOnInit(): void {
  }

  public onVisibilityChange(newValue: boolean){
    // if(newValue === this._visibility) return;
    this.visibilityChange.emit(newValue);
  }

  public onAccept(){
    if(this.maxDate)
      this.model.maxDate = this.maxDate.toISOString();
    if(this.minDate)
      this.model.minDate = this.minDate.toISOString();
    this.onChangeFn(this.model);
    this.visibility = false;
    this.cd.markForCheck();
  }

  public onCancel(){
    this.model = Object.assign({}, this.unchangedModel);
    this.onChangeFn(this.model);
    this.cd.markForCheck();
  }

  
}
