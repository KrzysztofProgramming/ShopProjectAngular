import { AuthService } from './auth.service';
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
        return this.authService.hasPermission(this.authService.PRODUCTS_MODIFY);
      }
      case "products":{
        return this.authService.hasPermission(this.authService.PRODUCTS_MODIFY);
      }
    }
    return true;
  }
  
}
