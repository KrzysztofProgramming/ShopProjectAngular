import { emailValidator } from './../../models/shop-validators';
import { AuthService } from '../../services/auth/auth.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { Validators, FormControl } from '@angular/forms';
import { passwordValidators, sameValueValidator, usernameValidators } from '../../models/shop-validators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { getErrorsMessage } from '../../models/shop-validators';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup = this.fb.group({
    username: ['', usernameValidators],
    email: ['', [emailValidator, Validators.required]],
    password: ['', passwordValidators],
    repeatPassword: ['', passwordValidators],
    regulations: [false, Validators.requiredTrue] 
  }, {validators: this.repeatPasswordValidator()});


  public error?: string;
  public unchangedAfterError: boolean = false;
  public waitingForRegister: boolean = false;
  private subscriptions: Subscription[] = [];

  public usernameTooltip: string = "";
  public emailTooltip: string = "";
  public passwordTooltip: string = "";
  public repeatPasswordTooltip: string = "";

  public repeatPasswordValidator(): ValidatorFn{
     return sameValueValidator("password", "repeatPassword");
  }

  public get username(): FormControl {
    return this.form.get("username") as FormControl;
  }

  public get email(): FormControl {
    return this.form.get("email") as FormControl;
  }

  public get password(): FormControl {
    return this.form.get("password") as FormControl;
  }

  public get repeatPassword(): FormControl {
    return this.form.get("repeatPassword") as FormControl;
  }

  public get regulations(): FormControl{
    return this.form.get("regulations") as FormControl;
  }


  constructor(private fb: FormBuilder, private authService: AuthService, private cd: ChangeDetectorRef,
     private messageService: MessageService) {

  }

  public onRegisterClick(){
    this.waitingForRegister = true;
    this.authService.doRegister(this.username.value, this.email.value, this.password.value)
    .subscribe(error =>{
      this.waitingForRegister = false;
      this.cd.markForCheck();
      this.error = error
      if(error.length > 0){
        this.unchangedAfterError = true;
        this.form.valueChanges.pipe(first()).subscribe(()=> this.unchangedAfterError = false);
        this.messageService.add({severity: "error", summary: "Register error", detail: error});
      }
      this.cd.markForCheck();
      if(!this.error)
        this.authService.navigateToProfile();
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.username.valueChanges.subscribe(this.updateUsernameTooltip.bind(this)),
      this.email.valueChanges.subscribe(this.updateEmailTooltip.bind(this)),
      this.password.valueChanges.subscribe(this.updatePasswordsTooltips.bind(this)),
      this.repeatPassword.valueChanges.subscribe(this.updatePasswordsTooltips.bind(this))
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public updateUsernameTooltip(){
    this.usernameTooltip = getErrorsMessage(this.username, c =>
       c.errors!.pattern ? "Nazwa użytkownika może zawierać jedynie cyfry, litery i znak _" : null);
    this.cd.markForCheck();
  }
  
  public updateEmailTooltip(){
    this.emailTooltip = getErrorsMessage(this.email);
    this.cd.markForCheck();
  } 

  public updatePasswordsTooltips(){
    this.passwordTooltip = getErrorsMessage(this.password);
    this.repeatPasswordTooltip = getErrorsMessage(this.repeatPassword);
    if(this.passwordTooltip.length === 0){
      this.passwordTooltip = this.isPasswordsError() ? "Hasła nie są takie same": "";
    }
    if(this.repeatPasswordTooltip.length === 0){
      this.repeatPasswordTooltip = this.isPasswordsError() ? "Hasła nie są takie same": "";
    }
  }

  private getErrorsMessage(control: AbstractControl, isPassword: boolean = true){
    let errorMessage = getErrorsMessage(control, c => c.errors!.pattern ? "Nazwa użytkownika może zawierać jedynie cyfry, litery i znak _" : null);
    return errorMessage.length !== 0 ? errorMessage : this.isPasswordsError() && isPassword ? "Hasła nie są takie same" : ""; 
  }

  public isPasswordsError(): boolean{
    if(this.form.errors == null) return false;
    return this.password.touched && this.repeatPassword.touched && this.form.errors?.notTheSameError;
  }

}
