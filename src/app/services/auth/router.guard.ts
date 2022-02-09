import { AuthService, Permissions } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterGuard implements CanActivate {
  
  public constructor(private authService: AuthService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    switch(route.url[0].path){
      case "login":{
        return !this.authService.isLogin();   
      }
      case "register":{
        return !this.authService.isLogin();
      }
      case "profile":{
        return this.authService.isLogin();
      }
      case "product":{
        return this.authService.hasOnePermission(Permissions.PRODUCTS_WRITE);
      }
      case "products":{
        return this.authService.hasOnePermission(Permissions.PRODUCTS_WRITE);
      }
      case "roles":{
        return this.authService.hasOnePermission(Permissions.ROLES_WRITE);
      }
      case "users":{
        return this.authService.hasOnePermission(Permissions.USERS_READ);
      }
    }
    return true;
  }
  
}
