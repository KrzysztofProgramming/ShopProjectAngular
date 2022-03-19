import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'shop-page-select',
  template: `
    <p-inputNumber
      class="input"
      [useGrouping]="false"
      [max]="this.totalPages"
      [min]="1"
      [step]="1"
      [showButtons]="true"
      buttonLayout="horizontal"
      incrementButtonClass="p-button-primary"
      decrementButtonClass="p-button-primary"
      incrementButtonIcon="pi pi-chevron-right"
      decrementButtonIcon="pi pi-chevron-left"
      [(ngModel)]="this.model"
      (ngModelChange)="this.onChangeFn($event)"
      (onBlur) = "this.onTouchedFn()"
    >
    </p-inputNumber>
    <p>/</p>
    <p class="total-pages">
      {{ this.totalPages }}
    </p>
  `,
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PageSelectComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./page-select.component.scss'],
})
export class PageSelectComponent implements OnInit, ControlValueAccessor {
  @Input() totalPages: number = 1;
  model: number = 1;
  onChangeFn: any = ()=>{};
  onTouchedFn: any = ()=>{};


  constructor(private cd: ChangeDetectorRef) {}

  writeValue(obj: any): void {
    this.model = obj;
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  ngOnInit(): void {}
}
