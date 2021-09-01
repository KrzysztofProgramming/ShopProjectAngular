import { AuthService } from '../../services/auth/auth.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { Validators, FormControl } from '@angular/forms';
import { passwordValidators, usernameValidators } from '../../models/shop-validators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getErrorsMessage } from '../../models/shop-validators';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {

  form: FormGroup = this.fb.group({
    username: ['', usernameValidators],
    email: ['', [Validators.email, Validators.required]],
    password: ['', passwordValidators],
    repeatPassword: ['', passwordValidators],
    regulations: [false, Validators.requiredTrue] 
  }, {validators: this.repeatPasswordValidator()});


  public error?: string
  public unchangedAfterError: boolean = false;
  public waitingForRegister: boolean = false;

  public repeatPasswordValidator(): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      return control.get("password")!.value !== control.get("repeatPassword")!.value ? {passwordsNotTheSame: true} : null
    }
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
  }

  public getErrorsMessage(control: AbstractControl){
    return getErrorsMessage(control, c => c.errors!.pattern ? "Nazwa użytkownika może zawierać jedynie cyfry, litery i znak _" : null);
  }

  public isPasswordsError(): boolean{
    if(this.form.errors == null) return false;
    return this.password.touched && this.repeatPassword.touched && this.form.errors?.passwordsNotTheSame;
  }

}
