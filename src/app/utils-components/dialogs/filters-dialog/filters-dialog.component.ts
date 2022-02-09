import { ProductsFiltersComponent } from '../../products-utils/products-filters/products-filters.component';
import { DEFAULT_PAGEABLE } from '../../../models/requests';
import { SortOption, SORT_OPTIONS, SORT_OPTION_DEFAULT } from '../../../models/models';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ProductsFiltersModel } from '../../products-utils/products-filters/products-filters.component';



export interface FiltersDialogModel extends ProductsFiltersModel{
  sort?: string;
  pageSize?: number;
}

@Component({
  selector: 'shop-filters-dialog',
  templateUrl: 'filters-dialog.component.html',
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FiltersDialogComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogComponent implements OnInit, ControlValueAccessor {
  _visibility: boolean = false;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  @ViewChild("filters")
  private filtersComp?: ProductsFiltersComponent;

  @Input("visibility")
  set visibilityInput(value: boolean){
    this._visibility = value;
    this.cd.markForCheck();
  }
  get visibilityInput(): boolean{
    return this._visibility;
  }

  set visibility(value: boolean){
    this._visibility = value;
    if(!value) this.collapseAllExpansions();
    this.visibilityChange.emit(value);
  }
  get visibility(): boolean{
    return this._visibility;
  }

  sortOptions: SortOption[] = SORT_OPTIONS;  

  public dialogModel: FiltersDialogModel = {};
  public dialogModelPrimal: FiltersDialogModel = {
    pageSize: DEFAULT_PAGEABLE.pageSize,
    sort: SORT_OPTION_DEFAULT.code
  };
  
  public sortOptionsExpanded: boolean = false;

  private onChangeFn: (value: FiltersDialogModel) => void = ()=>{};
  private onToucheFn: ()=>void = ()=>{}; 

  constructor(private cd: ChangeDetectorRef) {}

  writeValue(obj: FiltersDialogModel): void {
    this.dialogModel.pageSize = DEFAULT_PAGEABLE.pageSize;
    this.dialogModel.sort = SORT_OPTION_DEFAULT.code;
    this.resetDialogModel();
    Object.assign(this.dialogModel, obj);
    Object.assign(this.dialogModelPrimal, this.dialogModel);
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public collapseAllExpansions(){
    if(this.filtersComp) this.filtersComp.collapseAllExpansions();
    this.sortOptionsExpanded = false;
    this.cd.markForCheck();
  }

  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
  }

  public onInternalChange(){}

  public callOnTouche(){
    this.onToucheFn();
  }

  ngOnInit(): void {
  }

  public dialogAccepted(){
    this.visibility = false;
    this.onChangeFn(this.dialogModel);
    Object.assign(this.dialogModelPrimal, this.dialogModel);
    this.cd.markForCheck();
  }

  public resetDialogModel(){
    this.dialogModel = Object.assign({}, this.dialogModelPrimal);
    this.cd.markForCheck();
  }

  public dialogCancelled(){
    this.resetDialogModel();
  }

}
