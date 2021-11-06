import { UpdatePasswordRequest } from './../../../../models/requests';
import { getErrorsMessage } from 'src/app/models/shop-validators';
import { passwordValidators, sameValueValidator } from './../../../../models/shop-validators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shop-change-password',
  template: `
    <shop-dialog dialogTitle = "Zmień hasło" [(visibility)] = "this.visibility" (visibilityChange) = "this.setVisibility($event)"
    acceptPhrase = "potwierdź" denyPhrase = "anuluj" [acceptDisabled] = "this.formGroup.invalid" (accept) = "this.confirmPassword()">
      <form class="content" [formGroup] = "this.formGroup" (ngSubmit) = "this.confirmPassword()">

        <p class="content__header">Stare hasło:</p>
        <shop-password-input formControlName="oldPassword" class="content__password" pTooltip
         [pTooltip] = "this.getErrorMessage(this.oldPassword)"
         [invalid] = "this.oldPassword.invalid && this.oldPassword.touched" placeholder="stare hasło"></shop-password-input>

        <p class="content__header">Nowe hasło:</p>
        <shop-password-input formControlName="newPassword" class="content__password" pTooltip
         [pTooltip] = "this.getErrorMessage(this.newPassword, true)"
         [invalid]="this.newPassword.touched && (this.newPassword.invalid
             || (this.formGroup.errors?.notTheSameError && this.repeatPassword.touched))" placeholder="nowe hasło"></shop-password-input>

        <p class="content__header" >Powtórz nowe hasło:</p>
        <shop-password-input formControlName="repeatPassword" class="content__password" pTooltip
         [pTooltip] = "this.getErrorMessage(this.repeatPassword, true)"
         [invalid]="this.repeatPassword.touched && (this.repeatPassword.invalid
             || (this.formGroup.errors?.notTheSameError && this.newPassword.touched))" placeholder = "powtórz nowe hasło"></shop-password-input>
      </form>
    </shop-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  @Input() visibility: boolean = false;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() passwordConfirmed: EventEmitter<UpdatePasswordRequest> = new EventEmitter<UpdatePasswordRequest>();


  public formGroup: FormGroup = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', passwordValidators],
    repeatPassword: ['', passwordValidators]
  }, {validators: sameValueValidator("newPassword", "repeatPassword")})

  public get oldPassword(): AbstractControl{
    return this.formGroup.get("oldPassword")!;
  }

  public get newPassword(): AbstractControl{
    return this.formGroup.get("newPassword")!;
  }

  public get repeatPassword(): AbstractControl{
    return this.formGroup.get("repeatPassword")!;
  }
  
  public confirmPassword(){
    this.passwordConfirmed.emit({newPassword: this.newPassword.value, oldPassword: this.oldPassword.value});
    this.setVisibility(false);
  }

  public setVisibility(value: boolean){
    if(!value){
      this.formGroup.reset();
    }
    this.visibility = value;
    this.visibilityChange.emit(this.visibility);
  }

  public getErrorMessage(control: AbstractControl, includeSameError: boolean = false): string{
    let error = getErrorsMessage(control);
    return error.length > 0 ? error : this.isSameValueError() && includeSameError ? "Nowe hasła nie są takie same" : "";
  }

  public isSameValueError(){
    return this.newPassword.touched && this.newPassword.touched && this.formGroup.errors?.notTheSameError;
  }
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
