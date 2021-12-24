import { SimpleAuthor } from './../../models/models';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthorsService } from 'src/app/services/http/authors.service';


@Component({
  selector: 'shop-authors-select',
  template: `
    <shop-editable-multi-select (blur)="this.onTouchedFn()" [(ngModel)] = "model" (ngModelChange)="this.onChangedFn($event)"
    displayProperty="name" [waitingForDataFlag]="this.waitingForAuthors" [initializeItems]="this.allAuthors"></shop-editable-multi-select>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AuthorsSelectComponent,
    multi: true
  }],
  styleUrls: ['./authors-select.component.scss']
})
export class AuthorsSelectComponent implements OnInit, ControlValueAccessor {
  
  model: SimpleAuthor[] = [];
  allAuthors: SimpleAuthor[] = [];
  onChangedFn: any = ()=>{};
  onTouchedFn: any = ()=>{};
  waitingForAuthors: boolean = true;

  constructor(private authorsService: AuthorsService,private cd: ChangeDetectorRef) { }

  writeValue(obj: SimpleAuthor[]): void {
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
