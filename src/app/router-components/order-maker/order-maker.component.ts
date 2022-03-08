import { AuthService } from './../../services/auth/auth.service';
import { ToastMessageService } from './../../services/utils/toast-message.service';
import { ShoppingCartService } from './../../services/http/shopping-cart.service';
import { NewOrderRequest } from './../../models/requests';
import { OrdersService } from './../../services/http/orders.service';
import { getErrorsMessage } from 'src/app/models/shop-validators';
import { emailValidator } from './../../models/shop-validators';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProfileInfo, EMPTY_PROFILE_INFO, EMPTY_USER_INFO, UserInfo } from './../../models/models';
import { ProfileInfoService } from './../../services/http/profile-info.service';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-order-maker',
  templateUrl: './order-maker.component.html',
  styleUrls: ['./order-maker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderMakerComponent implements OnInit, OnDestroy {
  public waitingForResponse: boolean = false;
  public userLoggedIn: boolean = false;
  public saveAsDefault: boolean = false;

  public formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required, emailValidator]],
    info: [EMPTY_USER_INFO]
  })

  get infoControl(): AbstractControl{
    return this.formGroup.get("info")!;
  }

  get emailControl(): AbstractControl{
    return this.formGroup.get("email")!;
  }

  constructor(private profileService: ProfileInfoService, private cd: ChangeDetectorRef, private fb: FormBuilder,
    private ordersService: OrdersService, private cartService: ShoppingCartService, private messageService: ToastMessageService,
    private authService: AuthService) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  public getErrorMessage(control: AbstractControl): string{
    return getErrorsMessage(control);
  }

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.waitingForResponse = true;
    this.subscriptions.push(
      this.profileService.getProfileInfo().subscribe((val)=>{
        this.writeProfileInfo(val);
        this.waitingForResponse = false;
        this.userLoggedIn = true;
        this.cd.markForCheck();
      }, ()=>{
        this.waitingForResponse = false;
        this.cd.markForCheck();
      })
    )
  }
  
  public writeProfileInfo(info: ProfileInfo){
    this.infoControl.setValue(info.info);
    this.emailControl.setValue(info.email);
  }

  public onConfirm(){
    this.waitingForResponse = true;
    this.cd.markForCheck();
    this.ordersService.newOrder({
      email: this.emailControl.value,
      info: this.infoControl.value,
      products: this.cartService.currentCart.items
    }).subscribe(order=>{
      this.cartService.deleteCart().subscribe();
      this.messageService.showMessage({severity: 'success', summary: "Sukces", detail: "Złożono zamówienie"});
      this.waitingForResponse = false;
      this.authService.navigateToProfile();
      this.cd.markForCheck();
    }, error=>{
      let errorInfo: string = error.error.info || "Nie udało się złożyć zamówienia";
      this.messageService.showMessage({severity: 'error', summary:"Niepowodzenie", detail: errorInfo});
      this.waitingForResponse = false;
      this.cd.markForCheck();
    })
    if(this.saveAsDefault){
      this.profileService.updateUserInfo(this.infoControl.value).subscribe();
    }
  }

}
