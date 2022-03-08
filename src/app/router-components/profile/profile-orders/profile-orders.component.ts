import { GetOrdersResponse } from './../../../models/responses';
import { ProfileInfoService } from 'src/app/services/http/profile-info.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-profile-orders',
  templateUrl: './profile-orders.component.html',
  styleUrls: ['./profile-orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileOrdersComponent implements OnInit {
  
  public response?: GetOrdersResponse;
  public waitingForResponse: boolean = false;
  public isError: boolean = false;


  constructor(private profileService: ProfileInfoService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.waitingForResponse = true;
    this.profileService.getOrders({}).subscribe(result=>{
      this.response = result;
        this.waitingForResponse = false;
        this.cd.markForCheck();
    }, error=>{
      this.waitingForResponse = false;
      this.isError = true;
      this.cd.markForCheck();
    });
  }

}
