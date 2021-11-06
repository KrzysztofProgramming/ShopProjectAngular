import { AbstractControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getErrorsMessage, sameValueValidator } from 'src/app/models/shop-validators';

@Component({
  selector: 'shop-change-email',
  template: `
    <shop-dialog [(visibility)] = "this.visibility" (visibilityChange) = "this.setVisibility($event)" denyPhrase = "anuluj" acceptPhrase = "potwierdź" dialogTitle="Zmień email"
    [acceptDisabled] = "this.formGroup.invalid" (accept) = "this.onEmailSelected()" (deny) = "this.setVisibility(false)">
      <form class="content" [formGroup]="this.formGroup" (ngSubmit)="this.onEmailSelected()">

        <p class="content__header">Nowy email:</p>
        <input class="content__input" [invalid]="this.emailControl.touched && (this.emailControl.invalid
             || (this.formGroup.errors?.notTheSameError && this.repeatEmailControl.touched))"
         formControlName="email" shopInputText padding="small" pTooltip [pTooltip] = "this.getErrorMessage(this.emailControl)"
         placeholder="Nowy email" type=email>

        <p class="content__header">Powtórz email:</p>
        <input class="content__input" [invalid]="this.repeatEmailControl.touched && (this.repeatEmailControl.invalid
             || (this.formGroup.errors?.notTheSameError && this.emailControl.touched))"
         formControlName="repeatEmail" pTooltip [pTooltip] = "this.getErrorMessage(this.repeatEmailControl)"
         shopInputText padding="small" placeholder="Powtórz email" type=email>
      </form>
    </shop-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  @Input() visibility: boolean = true;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() emailSelected: EventEmitter<string> = new EventEmitter<string>();

  formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    repeatEmail: ['', [Validators.email, Validators.required]]
  }, {validators: sameValueValidator("email", "repeatEmail")});

  public setVisibility(value: boolean): void{
    if(!value){
      this.resetForms();
    }
    this.visibility = value;
    this.visibilityChange.emit(value);
  }

  public get emailControl(): AbstractControl{
    return this.formGroup.get("email")!;
  }

  public get repeatEmailControl(): AbstractControl{
    return this.formGroup.get("repeatEmail")!;
  }

  public getErrorMessage(control: AbstractControl): string{
    let error = getErrorsMessage(control);
    return error.length !==0 ? error : this.isEmailNotTheSameError() ? "Email'e nie są takie same" : "";
  }

  public isEmailNotTheSameError(){
    if(!this.formGroup.errors) return;
    return this.emailControl.touched && this.repeatEmailControl.touched && this.formGroup.errors.notTheSameError;
  }

  public onEmailSelected(){
    this.emailSelected.emit(this.emailControl.value);
    this.setVisibility(false);
  }

  private resetForms(){
    this.emailControl.reset();
    this.repeatEmailControl.reset();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
