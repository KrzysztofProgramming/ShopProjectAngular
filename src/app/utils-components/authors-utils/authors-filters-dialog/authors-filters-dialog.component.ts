import { DEFAULT_AUTHORS_PARAMS } from '../../../models/requests';
import { GetAuthorsParams } from 'src/app/models/requests';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { AUTHORS_SORT_OPTIONS } from 'src/app/models/models';

@Component({
  selector: 'shop-authors-filters-dialog',
  templateUrl: './authors-filters-dialog.component.html',
  styleUrls: ['./authors-filters-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AuthorsFiltersDialogComponent,
      multi: true
    }
  ]
})
export class AuthorsFiltersDialogComponent implements OnInit, ControlValueAccessor {

  _visibility: boolean = false;

  @Output()
  visibilityChange: EventEmitter<boolean> = new EventEmitter();

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
    if(!value) this.collapseExpansions();
  }

  private onChangeFn: any = ()=>{};
  private onToucheFn: any = ()=>{};
  public model: GetAuthorsParams = DEFAULT_AUTHORS_PARAMS;
  public unchangedModel: GetAuthorsParams = DEFAULT_AUTHORS_PARAMS;
  public sortSelectExpansion: boolean = false;
  readonly sortOptions = AUTHORS_SORT_OPTIONS;

  constructor(private cd: ChangeDetectorRef) { }

  writeValue(obj: any): void {
    this.model = Object.assign({}, DEFAULT_AUTHORS_PARAMS);
    this.model = Object.assign(this.model, obj);
    this.unchangedModel = Object.assign({}, this.model);
    this.cd.markForCheck();
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
    if(!newValue) this.collapseExpansions();
  }

  public onAccept(){
    this.onChangeFn(this.model);
    this.visibility = false;
    this.cd.markForCheck();
  }

  public onCancel(){
    this.model = Object.assign({}, this.unchangedModel);
    this.onChangeFn(this.model);
    this.cd.markForCheck();
  }

  public collapseExpansions(){
    this.sortSelectExpansion = false;
    this.cd.markForCheck();
  }

}
