import { ToastMessageService } from './../../services/utils/toast-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { sameValueValidator, getErrorsMessage } from 'src/app/models/shop-validators';
import { passwordValidators } from './../../models/shop-validators';
import { FormGroup, FormBuilder, AbstractControl, ValidatorFn } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'shop-reset-password',
  template: `
    <form class="wrapper" [formGroup]="this.formGroup" [ngClass]="{'hidden': !this.isTokenValid}" (ngSubmit)="this.onSubmit()">
      <p class="header wrapper__element">Reset hasła</p>

      <shop-password-input class="password wrapper__element input" placeholder="Nowe hasło"
       formControlName = "password" [invalid] = "this.passwordControl.touched && (this.passwordControl.invalid
        || (this.formGroup.errors?.notTheSameError && this.repeatPasswordControl.touched))"
        [pTooltip]="this.passwordTooltip"></shop-password-input>

      <shop-password-input class="repeat-password wrapper__element input" placeholder="Powtórz nowe hasło"
       formControlName = "repeatPassword" [invalid] = "this.repeatPasswordControl.touched && (this.repeatPasswordControl.invalid
         || (this.formGroup.errors?.notTheSameError && this.passwordControl.touched))"
         [pTooltip]="this.repeatPasswordTooltip"></shop-password-input>

      <button type="submit" shopButton class="confirm-button wrapper__element" [disabled]="this.formGroup.invalid">
        Potwierdź</button>
        <shop-busy-overlay *ngIf="this.waitingForResponse"></shop-busy-overlay>
    </form>
    <shop-wildcart class="this.isTokenValid" *ngIf="!this.isTokenValid && this.isTokenChecked"></shop-wildcart>
    <shop-busy-overlay *ngIf="!this.isTokenChecked"></shop-busy-overlay>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    
  formGroup: FormGroup = this.fb.group(
    {
      password: ['', passwordValidators],
      repeatPassword: ['', passwordValidators]
    },
    {validators: this.samePasswordsValidator()}
  )

  public repeatPasswordTooltip: string = "";
  public passwordTooltip: string = "";
  private subscriptions: Subscription[] = [];
  public waitingForResponse: boolean = false;
  public token?: string;
  public isTokenValid: boolean = false;
  public isTokenChecked: boolean = false;

  get passwordControl(): AbstractControl{
    return this.formGroup.get("password")!;
  }

  get repeatPasswordControl(): AbstractControl{
    return this.formGroup.get("repeatPassword")!;
  }

  private samePasswordsValidator(): ValidatorFn{
    return sameValueValidator("password", "repeatPassword");
  }

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private authService: AuthService,
     private routes: ActivatedRoute, private messageService: ToastMessageService, private router: Router) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.formGroup.valueChanges.subscribe(this.calcTooltips.bind(this)),
      this.routes.params.subscribe(params=>{
        this.isTokenChecked = false;
        this.isTokenValid = false;
        if(!params.id){
          this.redirectToLogin();
          // this.isTokenChecked = true;
          return;
        }
        this.token = params.id;
        this.authService.isResetTokenValid(this.token!).subscribe(value=>{
          if(!value){
            // console.log("invalid token");
            this.redirectToLogin();
            this.cd.markForCheck();
            return;
          }
          this.isTokenChecked = true;
          this.isTokenValid = value;
          this.cd.markForCheck();
        });
      })
    )
  }

  private redirectToLogin(){
    console.log("redirecting");
    // setTimeout(()=>{
      this.messageService.showMessage({severity: "error", summary:"Zły token", detail: "Spróbuj jeszcze raz zresetować hasło"});
      this.router.navigateByUrl('/notFound', {skipLocationChange: true});
    // }, 0);
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public onSubmit(){
    if(this.formGroup.invalid || !this.token) return;
    this.waitingForResponse = true;
    this.cd.markForCheck();
    this.authService.resetPassword({newPassword: this.passwordControl.value, token: this.token}).subscribe(error=>{
      if(!error){
        this.messageService.showMessage({severity: "success", summary: "Sukces", detail:"Pomyślnie zmieniono twoje hasło!"});
      }
      else{
        this.messageService.showMessage({severity: "error", summary: "Niepowodzenie", detail: error});
      }
      this.waitingForResponse = false;
      this.authService.navigateToLogin();
      this.cd.markForCheck();
    })
  }

  public calcTooltips(){
    if(this.formGroup.valid){
      this.passwordTooltip = "";
      this.repeatPasswordTooltip = "";
    }
    this.passwordTooltip = getErrorsMessage(this.passwordControl);
    this.repeatPasswordTooltip = getErrorsMessage(this.repeatPasswordControl);
    
    if(this.passwordTooltip.length === 0 && this.formGroup.errors?.notTheSameError && this.passwordControl.touched)
      this.passwordTooltip = "Hasła nie są takie same";
    if(this.repeatPasswordTooltip.length === 0 && this.formGroup.errors?.notTheSameError && this.repeatPasswordControl.touched)
      this.repeatPasswordTooltip = "Hasła nie są takie same";

    this.cd.markForCheck();
  }

}
