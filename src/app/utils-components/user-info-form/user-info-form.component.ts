import { getErrorsMessage } from 'src/app/models/shop-validators';
import { debounceTime } from 'rxjs/operators';
import { UserInfo, flattenObject, ProfileInfo, EMPTY_PROFILE_INFO, EMPTY_USER_INFO } from './../../models/models';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors, Validator, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, Input, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { InputMask } from 'primeng/inputmask';


@Component({
  selector: 'shop-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: ['./user-info-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      provide: NG_VALIDATORS,
      useExisting: UserInfoFormComponent,
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UserInfoFormComponent,
      multi: true
    }
  ]
})
export class UserInfoFormComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {

  @Output("submit") submitEmmiter: EventEmitter<void> = new EventEmitter();

  public formGroup: FormGroup = this.fb.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]],
    street: ['', [Validators.required]],
    houseNumber: [0, [Validators.required, Validators.min(1)]],
    localNumber: [0, [Validators.required, Validators.min(1)]],
    city: ['', [Validators.required]],
    zipCode: ['', [Validators.required]]
  });

  public setFormDisabledState(value: boolean){
    value ? this.formGroup.disable() : this.formGroup.enable();
  }

  private onChangeFn: any = ()=>{};
  private onToucheFn: any = ()=>{};
  private model: UserInfo = EMPTY_USER_INFO; 

  @ViewChild("zipCodeInput")
  private zipCodeInput!: InputMask;

  @ViewChild("phoneNumberInput")
  private phoneNumberInput!: InputMask;

  public get zipCodeValue(): number{
    if(typeof(this.zipCodeControl.value) !== 'string') return 0;
    let value = +(this.zipCodeControl.value as string).replace(/-/g, "");
    if(isNaN(value)) return 0;
    return value;
  }

  public get phoneNumberValue(): number{
    if(typeof(this.phoneNumberControl.value) !== 'string') return 0;
    let value = +(this.phoneNumberControl.value as string).replace(/ /g, "");
    if(isNaN(value)) return 0;
    return value;
  }

  public emitSubmit(){
    console.log("onSubmit emitted");
    this.submitEmmiter.emit();
  }

  public toPhoneString(phone: number): string{
    if(phone < 100000000 || phone > 999999999) return "--- --- ---";
    let phoneString = phone.toString();
    return phoneString.substring(0, 3) + " " + phoneString.substring(3,6) + " " + phoneString.substring(6);
  }

  public toZipCodeString(zipCode: number): string{
    if(zipCode < 10000 || zipCode > 99999) return "  -   ";
    let zipString = zipCode.toString();
    return zipString.substring(0, 2) + "-" + zipString.substring(2);
  }
  
  private subscriptions: Subscription[] = [];

  public getModel(): UserInfo{
    this.model.firstname = this.firstnameControl.value;
    this.model.lastname = this.lastnameControl.value;
    this.model.phoneNumber = this.phoneNumberValue;
    this.model.address.city = this.cityControl.value;
    this.model.address.houseNumber = this.houseNumberControl.value;
    this.model.address.localNumber = this.localNumberControl.value;
    this.model.address.street = this.streetControl.value;
    this.model.address.zipCode = this.zipCodeValue;
  
    return this.model;

  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder) { }

  public validate(control: AbstractControl): ValidationErrors | null {
    return this.isInvalid() ? {invalid: true} : null;
  }

  writeValue(obj: UserInfo): void {
    if(!obj){
      this.formGroup.reset();
      return;
    }
    this.model = Object.assign(this.model, obj);
    this.formGroup.setValue({
      firstname: this.model.firstname,
      lastname: this.model.lastname,
      phoneNumber: this.toPhoneString(this.model.phoneNumber),
      street: this.model.address.street,
      city: this.model.address.city,
      zipCode: this.toZipCodeString(this.model.address.zipCode),
      localNumber: this.model.address.localNumber,
      houseNumber: this.model.address.houseNumber
    });
    this.cd.markForCheck();
  }

  setDisabledState(value: boolean){
    if(value) this.formGroup.disable();
    else this.formGroup.enable();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
  }

  public getErrorMessage(control: AbstractControl): string{
    return getErrorsMessage(control);
  }

  public onPhoneInputFocus(){
    setTimeout(()=>{
      let elem = (this.phoneNumberInput.inputViewChild as ElementRef<HTMLTextAreaElement>).nativeElement;
      if(this.isPhoneNumberValid()){
        elem.setSelectionRange(11, 11);
        return;
      }
      elem.setSelectionRange(0, 0);
    }, 50)
  }

  public onZipCodeInputFocus(){
    setTimeout(()=>{
      let elem = (this.zipCodeInput.inputViewChild as ElementRef<HTMLTextAreaElement>).nativeElement;
      if(this.isZipCodeValid()){
        elem.setSelectionRange(6,6);
        return;
      }
      elem.setSelectionRange(0, 0);
    }, 50)
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(this.onValueChange.bind(this)),
    )
  }

  public isInvalid(): boolean{
    // console.log(this.validateMaskedInputs());
    return this.formGroup.invalid || !this.validateMaskedInputs();
  }

  public validateMaskedInputs(){
    console.log(this.isPhoneNumberValid());
    return this.isZipCodeValid() && this.isPhoneNumberValid();
  }

  public isZipCodeValid(){
    return this.zipCodeValue >= 10000 && this.zipCodeValue <= 99999
  }

  public isPhoneNumberValid(){
    return this.phoneNumberValue >= 100000000 && this.phoneNumberValue <= 999999999;
  }

  public onValueChange(){
    // if(this.isInvalid()){
    //   return;
    // };
    this.onChangeFn(this.getModel());
    this.cd.markForCheck();
  }

  public onTouche(){
    this.onToucheFn();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  
  public get firstnameControl(): AbstractControl{
    return this.formGroup.get("firstname")!;
  }

  public get lastnameControl(): AbstractControl{
    return this.formGroup.get("lastname")!;
  }

  public get phoneNumberControl(): AbstractControl{
    return this.formGroup.get("phoneNumber")!;
  }

  public get streetControl(): AbstractControl{
    return this.formGroup.get("street")!;
  }

  public get houseNumberControl(): AbstractControl{
    return this.formGroup.get("houseNumber")!;
  }

  public get localNumberControl(): AbstractControl{
    return this.formGroup.get("localNumber")!;
  }  

  public get cityControl(): AbstractControl{
    return this.formGroup.get("city")!;
  }  

  public get zipCodeControl(): AbstractControl{
    return this.formGroup.get("zipCode")!;
  }  

}
