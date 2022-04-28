import { SimpleAuthor } from './../../../models/models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { AuthorsService } from 'src/app/services/http/authors.service';

@Component({
  selector: 'shop-authors-select',
  template: `
    <shop-dropdown-multi-select *ngIf="this.type==='dropdown'" (blur)="this.onTouchedFn()"
     [(ngModel)] = "model" (ngModelChange)="this.onChangedFn($event)"
    displayProperty="name" [waitingForDataFlag]="this.waitingForAuthors" [items]="this.allAuthors"
    [invalid]="this.invalid" [(expanded)] = "this.expanded"
    (expandedChange)="this.expandedChange.emit($event)" modelProperty="id"></shop-dropdown-multi-select >

    <shop-accordion-multi-select *ngIf="this.type==='accordion'" (blur)="this.onTouchedFn()"
     [(ngModel)] = "model" (ngModelChange)="this.onChangedFn($event)"
    displayProperty="name" [waitingForDataFlag]="this.waitingForAuthors" [items]="this.allAuthors"
    [invalid]="this.invalid" [(expanded)] = "this.expanded"
    (expandedChange)="this.expandedChange.emit($event)" modelProperty="id"></shop-accordion-multi-select>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AuthorsSelectComponent,
    multi: true
  }],
  styleUrls: ['./authors-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorsSelectComponent implements OnInit, ControlValueAccessor {
  
  @Input() invalid: boolean = false;
  @Input() type: 'dropdown' | 'accordion' = 'dropdown';
  @Input() expanded: boolean = false;
  @Output() expandedChange: EventEmitter<boolean> = new EventEmitter();
  model: number[] = [];
  allAuthors: SimpleAuthor[] = [];
  onChangedFn: any = ()=>{};
  onTouchedFn: any = ()=>{};
  waitingForAuthors: boolean = true;

  constructor(private authorsService: AuthorsService,private cd: ChangeDetectorRef) { }

  writeValue(obj: number[]): void {
    this.model = obj;
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangedFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  ngOnInit(): void {
    this.refreshAuthors();
  }

  refreshAuthors(){
    this.waitingForAuthors = true;
    this.cd.markForCheck();
    this.authorsService.getSimpleAuthors().subscribe(response=>{
      this.allAuthors = response.simpleAuthors;
    },_error=>{
      this.allAuthors = [];
    }, ()=>{
      this.waitingForAuthors = false;
      this.cd.markForCheck();
    });
  }

}
