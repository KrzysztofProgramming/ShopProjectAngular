import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ProductsService } from './../../services/http/products.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'shop-types-select',
  template: `
    <shop-editable-multi-select [(ngModel)] = "model" [items]="this.allTypes" [invalid] = "this.invalid"
    (blur)="this.onTouchedFn()" (ngModelChange)="this.onChangeFn($event)" [waitingForDataFlag]="this.waitingForResponse"
    [editable]="this.editable">
    </shop-editable-multi-select>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TypesSelectComponent,
    multi: true
  }],
  styleUrls: ['./types-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypesSelectComponent implements OnInit, ControlValueAccessor {

  @Input() invalid: boolean = false;
  @Input() editable: boolean = true;
  @Input() type: 'dropdown' | 'list' = 'dropdown';
  model: string[] = [];
  onChangeFn: any = ()=>{};
  onTouchedFn: any = ()=>{};
  allTypes: string[] = [];
  waitingForResponse: boolean = false;

  constructor(private productsService: ProductsService, private cd: ChangeDetectorRef) { }

  writeValue(obj: string[]): void {
    this.model = obj
    this.cd.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  ngOnInit(): void {
    this.refreshTypes();
  }

  refreshTypes(): void{
    this.waitingForResponse = true;
    this.productsService.getTypes().subscribe(response=>{
      this.allTypes = response.types;
    }, _error=>{
      this.allTypes = [];
    }, ()=>{
      this.waitingForResponse = false;
      this.cd.markForCheck();
    })
  }

}
