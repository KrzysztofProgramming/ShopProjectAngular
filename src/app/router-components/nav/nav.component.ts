import { TreeMenuComponent } from './../../utils-components/tree-menu/tree-menu.component';
import { AuthService } from '../../services/auth/auth.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TreeItem } from 'src/app/utils-components/tree-menu/tree-menu.component';

@Component({
  selector: 'shop-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit {

  private productsItem: TreeItem = {
    label: "Produkty",
    items: [
      {
        label: "Przegląd produktów",
        routerLink: "products"
      },
      {
        label: "Dodaj produkt",
        routerLink: "manageProduct/new"
      }
    ]
  }

  private initializeNavItems: TreeItem[] = [
    {
      label: "Strona Główna",
      routerLink: "home"
    },
    {
      label: "Oferta",
      routerLink: "offert"
    },
    {
      label: "Regulamin",
      routerLink: "regulations"
    },
    {
      label: "O nas"
    },
  ];

  public navItems: TreeItem[] = [];

  public isLogin: boolean = false;
  public isExpanded: boolean = false;
  public refreshFlag: boolean = true;
  @ViewChild("sidebarMenu") sidebarMenu?: TreeMenuComponent;


  constructor(public authService: AuthService, public cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.authService.permissions.subscribe(_val=>{
      let items: TreeItem[] = this.initializeNavItems.slice();

      if(this.authService.hasPermission(this.authService.PRODUCTS_MODIFY)){
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

  public collapseSidebarMenu(): void{
    if(!this.sidebarMenu) return;
    this.sidebarMenu.collapseAll();
  }

  public markForCheck(){
    this.cd.markForCheck();
  }
}
