import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PAGE_SIZES, DEFAULT_PAGEABLE } from './../../models/requests';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'shop-page-size-select',
  template: `
      <div class="radio" *ngFor="let size of this.pageSizes">
        <p-radioButton class="radio-button" name="element-count" [value]="size" [(ngModel)]="this.model"
        [inputId]="'radio10' + size" (ngModelChange)="this.onChangeFn($event)" (onBlur) = "this.onToucheFn($event)" 
        [disabled]="this.isDisabled"></p-radioButton>
        <label [for]="'radio10' + size" class="radio-label">{{size}}</label>
      </div>
  `,
  styleUrls: ['./page-size-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PageSizeSelectComponent,
    multi: true
  }]
})
export class PageSizeSelectComponent implements OnInit, ControlValueAccessor {

  public model: number = DEFAULT_PAGEABLE.pageSize!;
  public pageSizes = PAGE_SIZES;
  public onChangeFn: any = ()=>{};
  public onToucheFn: any = ()=>{};
  public isDisabled: boolean = false;

  constructor(private cd: ChangeDetectorRef) { }

  writeValue(obj: any): void {
    this.model = obj;
    this.cd.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
  }
  setDisabledState(isDisabled: boolean): void{
    this.isDisabled = isDisabled;
  }



  ngOnInit(): void {

  }

}
