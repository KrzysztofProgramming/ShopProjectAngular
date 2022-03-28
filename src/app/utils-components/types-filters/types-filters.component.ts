import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GetAuthorsParams, DEFAULT_AUTHORS_PARAMS } from 'src/app/models/requests';

@Component({
  selector: 'shop-types-filters',
  templateUrl: './types-filters.component.html',
  styleUrls: ['./types-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TypesFiltersComponent,
      multi: true
    }
  ]
})
export class TypesFiltersComponent implements OnInit, ControlValueAccessor {

  @Output("modelStartChanging")
  public startChanging: EventEmitter<void> = new EventEmitter<void>();

  private subscriptions: Subscription[] = [];
  public model: GetAuthorsParams = DEFAULT_AUTHORS_PARAMS;
  public onChangeFn: any = ()=>{};
  public onToucheFn: any = ()=>{};
  public searchControl: FormControl = new FormControl('');
  
  constructor(private cd: ChangeDetectorRef) { }

  public onModelChange(){
    this.onChangeFn(this.model);
  }

  public onTouche(){
    this.onToucheFn();
  }

  writeValue(obj: any): void {
    this.model = Object.assign({}, obj);
    this.searchControl.setValue(this.model.searchPhrase, {emitEvent: false});
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.searchControl.valueChanges.subscribe(()=>this.startChanging.emit()),
      this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(value=>{
        this.model.searchPhrase = value;
        this.onModelChange();
      })
    )
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

}
