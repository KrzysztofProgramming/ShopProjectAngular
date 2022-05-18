import { AuthService, Permission, Permissions } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterGuard implements CanActivate {
  
  public constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    switch(route.url[0].path){
      case "login":{
        return !this.authService.isLogin() ? true : this.router.parseUrl("/profile");
      }
      case "register":{
        return !this.authService.isLogin() ? true : this.router.parseUrl("/profile");
      }
      case "profile":{
        return this.authService.isLogin() ? true : this.router.parseUrl("/login");
      }
      case "manageProduct":{
        return this.authService.hasOnePermission(Permissions.PRODUCTS_WRITE) ? true : this.router.parseUrl("/offert");
      }
      case "products":{
        return this.authService.hasOnePermission(Permissions.PRODUCTS_WRITE) ? true : this.router.parseUrl("/offert");
      }
      case "authors":{
        return this.authService.hasOnePermission(Permissions.PRODUCTS_WRITE) ? true : this.router.parseUrl("/home");
      }
      case "types":{
        return this.authService.hasOnePermission(Permissions.PRODUCTS_WRITE) ? true : this.router.parseUrl("/home");
      }
    }
    return true;
  }
  
}
