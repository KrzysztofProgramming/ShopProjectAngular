import { TreeMenuComponent } from './../../utils-components/tree-menu/tree-menu.component';
import { AuthService, Permissions } from '../../services/auth/auth.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TreeItem } from 'src/app/utils-components/tree-menu/tree-menu.component';

interface NavItem extends TreeItem{
  permission?: number;
  items?: NavItem[]
}

@Component({
  selector: 'shop-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent implements OnInit {

  // private productsItem: TreeItem = { 

  // }

  public navItems: NavItem[] = [
    {
      label: "Strona Główna",
      routerLink: "home",
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
    {
      label: "Produkty",
      permission: Permissions.PRODUCTS_WRITE.value,
      items: [
        {
          label: "Przegląd produktów",
          routerLink: "products",
        },
        {
          label: "Dodaj produkt",
          routerLink: "manageProduct/new",
        },
        {
          label: "Edytuj typy"
        },
        {
         label: "Edytuj autorów" 
        }
      ]
    }
  ];

  // public navItems: TreeItem[] = [];

  public isLogin: boolean = false;
  public isExpanded: boolean = false;
  public refreshFlag: boolean = true;
  @ViewChild("sidebarMenu") sidebarMenu?: TreeMenuComponent;


  constructor(public authService: AuthService, public cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.authService.permissions.subscribe(val=>{
      this.updateVisibility(val, this.navItems);
      this.refreshNavItems();
    })

    this.authService.loginStatus.subscribe(val=> this.isLogin = val);
  }

  public updateVisibility(permission: number, items: NavItem[]){
    items.forEach(item=>{
      item.visible = item.permission ? this.authService.hasOnePermission(item.permission) : true;
      if(item.items)
        this.updateVisibility(permission, item.items);
    })
    this.cd.markForCheck();
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
