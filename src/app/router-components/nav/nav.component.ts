import { AuthService } from '../../services/auth/auth.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'shop-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit {

  private productsItem: MenuItem = {
    label: "Produkty",
    items: [
      {
        label: "Przegląd produktów",
        routerLink: "products"
      },
      {
        label: "Dodaj produkt",
        routerLink: "product/new"
      }
    ]
  }

  private usersItem: MenuItem = {
    label: "Użytkownicy",
    items:[
      {
        label: "Dodaj użytkownika"
      },
      {
        label: "Przegląd użytkowników"
      }
    ]
  }

  private initializeNavItems: MenuItem[] = [
    {
      label: "Strona Główna"
    },
    {
      label: "Oferta"
    },
    {
      label: "Regulamin",
      routerLink: "regulations"
    },
    {
      label: "O nas"
    },
  ];

  public navItems: MenuItem[] = [];

  public isLogin: boolean = false;
  public isExpanded: boolean = false;
  public refreshFlag: boolean = true;

  constructor(public authService: AuthService, public cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.authService.permissions.subscribe(_val=>{
      let items: MenuItem[] = this.initializeNavItems.slice();
      if(this.authService.hasPermission(this.authService.USERS_GET)){
        items.push(this.usersItem);
      }
      if(this.authService.hasPermission(this.authService.USERS_MODIFY)){
        items.push(this.productsItem);
      }
      this.navItems = items;
      this.refreshNavItems();
    })

    this.authService.loginStatus.subscribe(val=> this.isLogin = val);
  }

  private refreshNavItems(){
    this.refreshFlag = false;
    setTimeout(() => {
      this.refreshFlag = true;
      this.cd.markForCheck();
    }, 1);
  }

  public expand(){
    this.isExpanded = true;
  }

  public hasUsersPermissions(): boolean{
    return this.authService.hasPermission(this.authService.USERS_GET | this.authService.USERS_MODIFY);
  }

  public hasProductsPermissions(): boolean{
    return this.authService.hasPermission(this.authService.PRODUCTS_MODIFY);
  }

  public logout(){
    this.authService.logout();
    this.authService.navigateToLogin();
  }

}
