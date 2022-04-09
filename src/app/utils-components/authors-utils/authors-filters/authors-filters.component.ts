import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { GetAuthorsParams, DEFAULT_AUTHORS_PARAMS } from '../../../models/requests';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'shop-authors-filters',
  templateUrl: './authors-filters.component.html',
  styleUrls: ['./authors-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AuthorsFiltersComponent,
      multi: true
    }
  ]
})
export class AuthorsFiltersComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @Output("modelStartChanging")
  public startChanging: EventEmitter<void> = new EventEmitter<void>();

  private subscriptions: Subscription[] = [];
  public model: GetAuthorsParams = DEFAULT_AUTHORS_PARAMS;
  public onChangeFn: any = ()=>{};
  public onToucheFn: any = ()=>{};
  public searchControl: FormControl = new FormControl('');
  
  constructor(private cd: ChangeDetectorRef) { }

  public onModelChange(){
    console.log(this.model);
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
        this.cd.markForCheck();
      })
    )
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

}
