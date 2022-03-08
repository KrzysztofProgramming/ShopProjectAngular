import { Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'shop-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  public selectedChildRoute: string = "";

  constructor(public route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef) { }


  ngOnDestroy(): void {
     this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe(event=>{
        if(event instanceof NavigationEnd && this.route.firstChild?.snapshot.routeConfig?.path){
            this.selectedChildRoute = this.route.firstChild.snapshot.routeConfig.path;
            this.cd.markForCheck();
        }
      })
    )
    this.selectedChildRoute = this.route.firstChild?.snapshot.routeConfig?.path? this.route.firstChild?.snapshot.routeConfig?.path : "";
  }

  public shouldHighlight(){
  }

}
