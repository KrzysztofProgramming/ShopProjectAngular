import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'shop-checkbox',
  template: `
    <div class="checkbox" [ngClass]="{'checkbox--checked': this.checked, 'checkbox--unchecked': !this.checked, 
      'checkbox--disabled': this.disabled}">
      <i [ngClass]="{'pi': this.checked, 'pi-check': this.checked}"></i>
    <div>
  `,
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  
  @Input() switchable: boolean = true;
  @Input() disabled: boolean = false;

  @HostListener("click")
  onClick(): void{
    if(!this.switchable || this.disabled) return;
    this.toggle();
    this.cd.detectChanges();
  }

  public checked: boolean = false;
  private onChangeFn: any = () =>{};


  constructor(private cd: ChangeDetectorRef) { }

  public toggle(): void{
    this.checked = !this.checked;
    this.onChangeFn(this.checked);
    this.cd.markForCheck();
  }

  writeValue(obj: any): void {
    this.checked = obj;
    this.cd.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    //ignore
  }

  ngOnInit(): void {
  }

}
