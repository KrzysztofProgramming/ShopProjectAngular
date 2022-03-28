import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetAuthorsParams, DEFAULT_AUTHORS_PARAMS } from 'src/app/models/requests';

@Component({
  selector: 'shop-types-filters-dialog',
  templateUrl: './types-filters-dialog.component.html',
  styleUrls: ['./types-filters-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TypesFiltersDialogComponent,
    multi: true
  }]
})
export class TypesFiltersDialogComponent implements OnInit, ControlValueAccessor  {

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
  public set visibilityInput(value: boolean){
    this._visibility = value;
  }
  public get visibilityInput():boolean{
    return this._visibility;
  }

  private onChangeFn: any = ()=>{};
  private onToucheFn: any = ()=>{};
  public model: GetAuthorsParams = DEFAULT_AUTHORS_PARAMS;
  public unchangedModel: GetAuthorsParams = DEFAULT_AUTHORS_PARAMS;

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

}
