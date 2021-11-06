import { Subscription } from 'rxjs';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { paddingSize } from 'src/app/directives/input-text/input-text.directive';

@Component({
  selector: 'shop-password-input',
  template: `
  <div class="password" [ngClass] = "{'password--small-padding': this.padding === 'small',
   'password--normal-padding': this.padding === 'normal', 'password--invalid': this.invalid}">

    <input [type] = "this.passwordVisibility ? 'text' : 'password'" [formControl] = "this.passwordControl"
     (blur) = "this.onTouchedFn(this.passwordControl.value)" [placeholder] = "this.placeholder">
    <i class="pi" (click)="this.switchPasswordVisibility()"
     [ngClass] = "{'pi-eye': !this.passwordVisibility, 'pi-eye-slash': this.passwordVisibility}"></i>
  <div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PasswordInputComponent,
    multi: true
  }],
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() padding: paddingSize = "normal";
  @Input() invalid: boolean = false;
  @Input() placeholder: string = "";

  public passwordControl: FormControl = new FormControl();

  public passwordVisibility: boolean = false;

  public onChangeFn: any = () => {};
  public onTouchedFn: any = () => {};

  public subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.passwordControl.valueChanges.subscribe(value=>this.onChangeFn(value))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public switchPasswordVisibility(): void{
    this.passwordVisibility = !this.passwordVisibility;
  }

  writeValue(obj: any): void {
    this.passwordControl.setValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }
  setDisabledState(value: boolean): void{
    if(value) this.passwordControl.disable();
    else this.passwordControl.enable();
  }

}
