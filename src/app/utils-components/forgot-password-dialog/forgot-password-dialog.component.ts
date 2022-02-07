import { ToastMessageService } from './../../services/utils/toast-message.service';
import { AuthService } from './../../services/auth/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, ChangeDetectionStrategy, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shop-forgot-password-dialog',
  template: `
    <shop-dialog dialogTitle="Odzyskiwanie hasła" [(visibility)]="this._visibility" (visibilityChange)="this.visibilityChange.emit($event)"
    cancelPhrase="Anuluj" acceptPhrase="Potwierdź" [acceptDisabled]="this.emailControl.invalid" (accept)="this.sendForgotRequest()"
    [busyOverlay]="this.waitingForResponse">
      <div class="wrapper">
        <p class="header">Podaj nam swój email, a link do resetu hasła zostanie na niego wysłany</p>
        <form class="form" (ngSubmit)="this.sendForgotRequest()">
          <label class="form__label" for="email-input">Email:</label>
          <input id="email-input" class="form__input" shopInputText placeholder="Twój email" type="email"
          [formControl] = "this.emailControl" [invalid] = "this.emailControl.invalid && this.emailControl.touched">
        </form>
      </div>
    </shop-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnInit {
  
  @Input("visibility")
  _visibility: boolean = false;

  @Output()
  visibilityChange: EventEmitter<boolean> = new EventEmitter();
  public waitingForResponse: boolean = false;


  set visibility(value: boolean){
    this._visibility = value;
    this.visibilityChange.emit(value);
    this.cd.markForCheck();
  }
  get visibility(): boolean{
    return this._visibility;
  }

  emailControl: FormControl = new FormControl('', [Validators.email, Validators.required]);

  // private subscriptions: Subscription[] = [];

  constructor(private authService: AuthService, private cd: ChangeDetectorRef, private messageService: ToastMessageService) {
    
  }

  ngOnInit(): void {
    
  }

  public sendForgotRequest(){
    if(this.emailControl.invalid) return;
    this.waitingForResponse = true;
    this.authService.sendForgotPasswordRequest(this.emailControl.value).subscribe(error=>{
      this.waitingForResponse = false;
      this.visibility = false;
      if(!error){
        this.messageService.showMessage({severity: "success", summary: "Powodzenie",
         detail: "Linkt do resetu hasła został wysłany na twojego maila"});
      }
      if(error){
        this.messageService.showMessage({severity: "error", summary: "Niepowodzenie",
        detail: error});
      }
      this.emailControl.reset();
      this.cd.markForCheck();
    })
    this.cd.markForCheck();
  }

}
