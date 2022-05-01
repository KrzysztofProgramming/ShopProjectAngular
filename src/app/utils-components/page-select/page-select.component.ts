import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';

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
      [formControl] = "this.modelControl"
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
export class PageSelectComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() totalPages: number = 1;
  @Output() modelStartChanging: EventEmitter<number> = new EventEmitter();
  modelControl: FormControl = new FormControl(1);
  onChangeFn: any = ()=>{};
  onTouchedFn: any = ()=>{};
  private subscriptions: Subscription[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.modelControl.valueChanges.subscribe(value=>this.modelStartChanging.emit(value)),
      this.modelControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value=>this.onChangeFn(value))
    )
  }

  writeValue(obj: any): void {
    this.modelControl.setValue(obj, {emitEvent: false});
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
}
