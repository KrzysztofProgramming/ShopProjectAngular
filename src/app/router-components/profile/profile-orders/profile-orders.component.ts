import { OrderStatuses, ORDERS_SORT_OPTIONS, ShopOrder, SORT_OPTIONS, SORT_OPTION_DEFAULT } from './../../../models/models';
import { DEFAULT_AUTHORS_PARAMS } from 'src/app/models/requests';
import { Subscription } from 'rxjs';
import { GetOrdersParams, DEFAULT_PAGEABLE, PAGE_SIZES, OrdersSortType } from './../../../models/requests';
import { GetOrdersResponse } from './../../../models/responses';
import { ProfileInfoService } from 'src/app/services/http/profile-info.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { resetFakeAsyncZone } from '@angular/core/testing';

@Component({
  selector: 'app-profile-orders',
  templateUrl: './profile-orders.component.html',
  styleUrls: ['./profile-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileOrdersComponent implements OnInit, OnDestroy {
  
  public response?: GetOrdersResponse;
  public waitingForResponse: boolean = false;
  public isError: boolean = false;
  public params: GetOrdersParams = Object.assign({}, DEFAULT_PAGEABLE);
  public currentRequest?: Subscription;
  private subscriptions: Subscription[] = [];
  public readonly pageSizes = PAGE_SIZES;
  public readonly sortOptions = ORDERS_SORT_OPTIONS;
  public filtersDialogVisibility: boolean = false;
  

  constructor(private profileService: ProfileInfoService, private cd: ChangeDetectorRef, private router: Router,
     private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  ngOnInit(): void {
     this.subscriptions.push(
        this.route.queryParams.subscribe(params=>{
          // this.params = Object.assign({}, params);
          // if(params.status) this.params.status = +params.status;
          this.reloadOrders(params);
          // this.cd.markForCheck();
        })
     )
  }

  public reloadOrders(params: Params = this.route.snapshot.queryParams){
    this.currentRequest?.unsubscribe();
    this.waitingForResponse = true;
    this.currentRequest = this.profileService.getOrders(params).subscribe(response=>{
        let newParams = Object.assign({}, DEFAULT_PAGEABLE);
        newParams = Object.assign(newParams, params);
        if(params.status)
         newParams.status = Object.values(OrderStatuses).includes(+params.status) ? +params.status : this.params.status;
        if(params.pageSize) newParams.pageSize = +params.pageSize;
        this.response = response;
        this.response.totalPages = Math.max(1, response.totalPages);
        newParams.pageNumber = Math.max(response.totalPages, response.pageNumber);
        
        this.params = Object.assign({}, newParams);

        this.waitingForResponse = false;
        this.cd.markForCheck();
    }, error=>{
      this.waitingForResponse = false;
      this.isError = true;
      this.params = Object.assign({}, DEFAULT_PAGEABLE);
      this.navigateToParams(true);
      this.cd.markForCheck();
    })
  }

  public navigateToParams(skipLocationChange: boolean = false){
    let params = Object.assign({}, this.params);
    if(params.pageSize === DEFAULT_PAGEABLE.pageSize) params.pageSize = undefined;
    if(params.pageNumber === DEFAULT_PAGEABLE.pageNumber) params.pageNumber = undefined;
    this.router.navigate([], {relativeTo: this.route, queryParams: params, skipLocationChange: skipLocationChange});
  }

  public cancelRequest(){
    if(this.currentRequest){
      this.currentRequest.unsubscribe();
    }
  }

  public trackByOrderId(index: number, order: ShopOrder): number{
    return order.id;
  }

  public openFiltersDialog(){
    this.filtersDialogVisibility = true;
  }

}

