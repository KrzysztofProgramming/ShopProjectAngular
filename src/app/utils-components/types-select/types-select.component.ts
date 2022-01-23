import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ProductsService } from './../../services/http/products.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'shop-types-select',
  template: `
    <shop-dropdown-multi-select *ngIf="this.type === 'dropdown'" [(ngModel)] = "model" [items]="this.allTypes"
     [invalid] = "this.invalid"(blur)="this.onTouchedFn()" (ngModelChange)="this.onChangeFn($event)"
     [waitingForDataFlag]="this.waitingForResponse" [(expanded)] = "this.expanded"
    (expandedChange)="this.expandedChange.emit($event)"></shop-dropdown-multi-select>

    <shop-accordion-multi-select *ngIf="this.type === 'accordion'" [(ngModel)] = "model" [items]="this.allTypes"
     [invalid] = "this.invalid"(blur)="this.onTouchedFn()" (ngModelChange)="this.onChangeFn($event)"
     [waitingForDataFlag]="this.waitingForResponse" [(expanded)] = "this.expanded"
    (expandedChange)="this.expandedChange.emit($event)"></shop-accordion-multi-select>
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
  @Input() type: 'dropdown' | 'accordion' = 'dropdown';
  @Input() expanded: boolean = false;
  @Output() expandedChange: EventEmitter<boolean> = new EventEmitter();
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
    this.productsService.getTypes().pipe(
      finalize(()=>{
        this.waitingForResponse = false;
        this.cd.markForCheck();
      })
    ).subscribe(response=>{
      this.allTypes = response.types;
    }, _error=>{
      this.allTypes = [];
    });
  }

}
