import { catchError, filter, switchMap, first } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isTokenRefreshing: boolean = false;
  private jwtTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  //  private authService!: AuthService;

  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.authService.isLogin()){
      request = this.withToken(request, this.authService.getJwtToken()!)
    } 
    
    return next.handle(request).pipe(catchError((error: any) => {
      if(error instanceof HttpErrorResponse && error.status === 401){
        return this.handle401Error(request, next, error);
      }
      else{
        return throwError(error);
      }
    }));
  }

  public handle401Error(request: HttpRequest<unknown>, next: HttpHandler, error: any): Observable<HttpEvent<unknown>>{
    if(!this.isTokenRefreshing){
        this.isTokenRefreshing = true;
        this.jwtTokenSubject.next(null);
        console.log("interceptor refresh");
        return this.authService.doTokenRefreshing().pipe(
          switchMap((token: string | null) =>{
            this.isTokenRefreshing = false;
            if(!token){
              this.jwtTokenSubject.next("");
              return throwError(error);
            }
            this.jwtTokenSubject.next(token);
            return next.handle(this.withToken(request, token));
          }
        )
        )
    }
    else{
        return this.jwtTokenSubject.pipe(
          filter(value => value !=null ),
          first(),
          switchMap(token => {
            if(token!.length === 0){return throwError(error);};
            return next.handle(this.withToken(request, token!))
          })
        )
    }

  }

  public withToken(request: HttpRequest<any>, token: string){
    return request.clone({
      setHeaders:{
        'Authorization': token,
        "Access-Control-Allow-Origin": '*'
      }
    })
  }
}
