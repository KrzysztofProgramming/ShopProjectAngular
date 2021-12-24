import { ToastMessageService } from '../../services/utils/toast-message.service';
import { AuthService } from '../..//services/auth/auth.service';

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { getErrorsMessage, usernameOrEmailValidator } from '../../models/shop-validators';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';

@Component({
  selector: 'shop-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {


  public loginFailed: boolean = false;
  public waitingForLogin: boolean = false;
  public unchangedAfterError: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private cd: ChangeDetectorRef,
     private messageService: ToastMessageService) { }

  public form: FormGroup = this.fb.group({
    username: ['', [usernameOrEmailValidator, Validators.required]],
    password: ['', Validators.required]
  })


  public get usernameControl(): FormControl {
    return this.form.get("username") as FormControl;
  }

  public get passwordControl() : FormControl{
    return this.form.get("password") as FormControl;
  }

  ngOnInit(): void {
  }

  public onLoginClick(){
    this.waitingForLogin = true;
    this.authService.doLogin(this.usernameControl.value, this.passwordControl.value).subscribe(success =>{
      this.waitingForLogin = false;
      this.cd.markForCheck();
      this.passwordControl.reset();
      if(!success){
        this.messageService.showMessage({severity: "error", summary: "Login error", detail: "Nie udało się zalogować, sprawdź poprawność danych"});
        this.unchangedAfterError = true;
        this.form.valueChanges.pipe(first()).subscribe(()=> this.unchangedAfterError = false);
      }
      if(success) this.authService.navigateToProfile();
    });
  }

  public getErrorsMessage(control: AbstractControl){
    return getErrorsMessage(control);
  }
}
