import { JwtToken } from './../../models/models';
import { LoginRequest, RegisterRequest, RefreshRequest } from './../../models/requests';
import { LoginResponse, ErrorResponse } from './../../models/responses';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, first, map, mapTo, shareReplay, tap } from "rxjs/operators"
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
}
)
export class AuthService{

  private readonly url = "http://localhost:8080/api/auth/"

  readonly NO_PERMISSION = 0;
  readonly PRODUCTS_MODIFY = 1;
  readonly USERS_MODIFY = 1 << 1;
  readonly USERS_GET = 1 << 2;


  private jwtToken?: string | null;
  private refreshToken?: string | null;
  
  private permissionsSubject: BehaviorSubject<number> = new BehaviorSubject(0);
  private loginStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private refreshingProcess: Observable<string | null> | null = null;
  

  public get permissions(): Observable<number> {
    return this.permissionsSubject;
  }

  public get loginStatus(): Observable<boolean> {
    return this.loginStatusSubject;
  }

  public getJwtToken(): string | null | undefined{
    return this.jwtToken;
  }

  public getRefreshToken(): string | null | undefined{
    return this.refreshToken;
  }

  constructor(private http: HttpClient, private router: Router) {
    this.jwtToken = localStorage.getItem("jwtToken");
    this.refreshToken = localStorage.getItem("refreshToken");
    if (this.jwtToken != null) {
      try{
        this.readValuesFromJwt();
      }
      catch(_ignore: any){
      }
    }
    setTimeout(() => {
      console.log("authService refrehs");
      this.doTokenRefreshing().subscribe();
    }, 0);
  }

  public doLogin(usernameOrEmail: string, password: string): Observable<boolean> {
    let body: LoginRequest = { usernameOrEmail: usernameOrEmail, password: password };

    return this.http.post<LoginResponse>(this.url + "login", body)
      .pipe(
        tap(this.tapToLogin()),
        mapTo(true),
        catchError((_error, _value) => {
          return of(false);
        })
      )
  }

  public doTokenRefreshing(): Observable<string | null> {
    if(this.refreshingProcess!=null) return this.refreshingProcess;
    if (this.refreshToken == null) return of(null);
    let body: RefreshRequest = { refreshToken: this.refreshToken }
    console.log("starting refreshing");
    this.refreshingProcess = this.http.post<LoginResponse>(this.url + "refresh", body)
    .pipe(
      finalize(()=>{this.refreshingProcess = null;}),
      tap(this.tapToLogin()),
      map((val: LoginResponse) => {return val.jwtToken ? val.jwtToken : null;}),
      catchError((_error: any, _val) => {
        this.logoutWithNoRequest();
        return of(null);
      }),
      shareReplay()
    );
    return this.refreshingProcess;
  }


  public doRegister(username: string, email: string, password: string): Observable<string> {
    let body: RegisterRequest = { username: username, email: email, password: password };

    return this.http.post<LoginResponse>(this.url + "register", body)
      .pipe(
        tap(this.tapToLogin()),
        mapTo(""),
        catchError((error, _value) => {
          return of(error.error ? (error.error as ErrorResponse).info : "Błąd rejestracji");
        })
      )
  }

  private tapToLogin() {
    return (response: LoginResponse): void => {
      console.log("tap to login");
      this.jwtToken = response.jwtToken;
      this.refreshToken = response.refreshToken;

      if (this.jwtToken != null) {
        localStorage.setItem("jwtToken", this.jwtToken);
        this.readValuesFromJwt();
      }
      if (this.refreshToken != null) localStorage.setItem("refreshToken", this.refreshToken);
    }
  }

  private readValuesFromJwt() {
    if (this.loginStatusSubject.value != this.isLogin())
      this.loginStatusSubject.next(this.isLogin());

    if (this.jwtToken == null) return;

    let decodedToken = jwtDecode(this.jwtToken) as JwtToken;
    if (this.permissionsSubject.value != decodedToken.authorities)
      this.permissionsSubject.next(decodedToken.authorities);
  }


  private logoutWithNoRequest() {
    this.refreshToken = null;
    this.jwtToken = null;
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("jwtToken");
    if(this.permissionsSubject.value != 0) this.permissionsSubject.next(0);
    if(this.loginStatusSubject.value) this.loginStatusSubject.next(false);
  }

  public logout(){
    this.logoutWithNoRequest();
    this.http.post(this.url + "logout", {});
  }


  public isLogin(): boolean {
    return this.jwtToken != null;
  }

  public hasPermission(permission: number) {
    return (this.permissionsSubject.value & permission) > 0;
  }

  public navigateToLogin(){
    this.router.navigateByUrl("/login");
  }

  public navigateToProfile(){
    this.router.navigateByUrl("/profile/settings");
  }

}
