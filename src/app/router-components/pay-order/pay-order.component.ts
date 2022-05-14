import { trigger } from '@angular/animations';
import { switchMap } from 'rxjs/operators';
import { OrdersService } from './../../services/http/orders.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pay-order',
  template: `
    <div class="waiting" *ngIf="this.waitingForResponse">
      <p class="waiting__text">Ładowanie <i class="pi pi-spin pi-spinner"></i></p>
    </div>
    <div class="success" *ngIf="!this.waitingForResponse">
      <i class="pi pi-check-circle"></i>
      <p class="success__text">Sukces, produkt został opłacony! Zobacz nasze inne wspaniałe ksiażki</p>
      <a routerLink="/offert" shopButton padding="medium">Oferta</a>
    </div>
  `,
  styleUrls: ['./pay-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // trigger("changingDots", [
    //   trigger(":increment", [
    //     style()
    //   ])
    // ])
  ]
})
export class PayOrderComponent implements OnInit, OnDestroy {  

  private subscription: Subscription[] = [];
  public waitingForResponse: boolean = true;
  public animationCounter: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private ordersService: OrdersService, 
    private cd: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    this.subscription.forEach(sub=>sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscription.push(
      this.route.paramMap.pipe(
        switchMap(paramsMap=>{
          this.waitingForResponse = true;
          this.cd.markForCheck();
          return this.ordersService.payOrder(paramsMap.get("id")!);
        })
      ).subscribe(()=>{
        this.waitingForResponse = false;
        this.cd.markForCheck();
      }, error=>{
        // this.waitingForResponse = false;
        // this.cd.markForCheck();
        this.navigateToNotFound();
      })
    )
  }

  private navigateToNotFound(){
    this.router.navigate(['notFound'], {skipLocationChange: true});
  }

}
