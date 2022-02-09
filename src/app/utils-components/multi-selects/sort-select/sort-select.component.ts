import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SORT_OPTIONS, SortOption, SORT_OPTION_DEFAULT } from '../../../models/models';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'shop-sort-select',
  template: `
    <p-dropdown class="top-bar__sorting" [options]="this.sortOptions" placeholder="Sortowanie" optionLabel="name"
    [(ngModel)]="this.sortOptionModel" (blur) = "this.onTouchedFn()" (ngModelChange)="this.callOnChange($event)"></p-dropdown>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SortSelectComponent,
      multi: true
    }
  ],
  styles: []
})
export class SortSelectComponent implements ControlValueAccessor {
  public sortOptions: SortOption[] = SORT_OPTIONS;
  public sortOptionModel: SortOption = SORT_OPTION_DEFAULT;
  public onChangeFn: (value: string)=>void = ()=>{}
  public onTouchedFn: ()=>void = ()=>{};

  constructor() { }
  writeValue(obj: string): void {
    this.sortOptionModel = this.sortOptions.find(item=>item.code === obj) || SORT_OPTION_DEFAULT;
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public callOnChange(newValue: SortOption){
    this.onChangeFn(newValue.code);
  }


}
