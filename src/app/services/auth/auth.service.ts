import { JwtToken, Role } from './../../models/models';
import { LoginRequest, RegisterRequest, RefreshRequest, CheckResetTokenRequest, ForgotPasswordRequest, ResetPasswordRequest } from './../../models/requests';
import { LoginResponse, ErrorResponse } from './../../models/responses';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, distinctUntilChanged, finalize, map, mapTo, shareReplay, tap } from "rxjs/operators";
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';

export class Permission{
  constructor(public readonly value: number, public readonly name: string) {}
}

export class Permissions{
  static readonly NO_PERMISSION = new Permission(0, "");
  static readonly PRODUCTS_WRITE = new Permission(1, "products:write");
  static readonly USERS_READ = new Permission(1 << 1, "users:read");
  static readonly USERS_WRITE = new Permission(1 << 2, "users:write");
  static readonly ROLES_WRITE = new Permission(1 << 3, "roles:write");
  static readonly ALL_PERMS = (1 << 5) - 1;

  public static fromNumber(value: number): Permission[]{
    let perms: Permission[] = Object.values(Permissions);
    return perms.filter((perm) => (value & perm.value) > 0);
  }

  public static toNumber(permissions: Permission[]): number{
    return permissions.map(perm => perm.value).reduce((previous, current) => (previous | current));
  }

  public static asArray(): Permission[]{
    return Object.values(Permissions);
  }
}

@Injectable({
  providedIn: "root"
})
export class AuthService{

  private readonly url = "http://localhost:8080/api/auth/";

  private jwtToken?: string | null;
  private refreshToken?: string | null;
  
  private permissionsSubject: BehaviorSubject<number> = new BehaviorSubject(Permissions.NO_PERMISSION.value);
  private loginStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private refreshingProcess: Observable<string | null> | null = null;
  private rolesSubject: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  

  public get permissions(): Observable<number> {
    return this.permissionsSubject.pipe(distinctUntilChanged());
  }

  public get rolesChange(): Observable<Role[]>{
    return this.rolesSubject;
  }

  public get loginStatus(): Observable<boolean> {
    return this.loginStatusSubject.pipe(distinctUntilChanged());
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
      if(response.roles) this.rolesSubject.next(response.roles)

      if (this.jwtToken) {
        localStorage.setItem("jwtToken", this.jwtToken);
        // this.loginStatusSubject.next(true);
        // console.log("next login status");
        this.readValuesFromJwt();
      }
      if (this.refreshToken) localStorage.setItem("refreshToken", this.refreshToken);
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
    this.http.post(this.url + "logout", {}).subscribe();
    this.logoutWithNoRequest();
  }


  public isLogin(): boolean {
    return this.jwtToken != null;
  }

  public navigateToLogin(){
    this.router.navigate(['/login']);
    // this.router.navigateByUrl("/login");
  }

  public navigateToProfile(){
    this.router.navigate(["/profile/settings"]);
    // this.router.navigateByUrl("/profile/settings");
  }

  public hasOnePermission(permissions: number | Permission) {
    return (this.permissionsSubject.value & (typeof(permissions) === 'number' ? permissions : permissions.value)) > 0;
  }

  public hasAllPermissions(permissions: number | Permission){
    return (this.permissionsSubject.value & (typeof(permissions) === 'number' ? permissions : permissions.value)) === permissions;
  }

  public isResetTokenValid(token: string): Observable<boolean>{
    let request: CheckResetTokenRequest = {token: token};
    return this.http.post<unknown>(`${this.url}isResetTokenValid`, request).pipe(
      mapTo(true),
      catchError(()=>of(false)),
    );
  }

  public sendForgotPasswordRequest(email: string): Observable<string | null>{
    let request: ForgotPasswordRequest = {email: email};
    return this.http.post<unknown>(`${this.url}forgotPassword`, request,).pipe(
      mapTo(null),
      catchError((error)=>of(error.error ? error.error.info : "Nie udało się wysłać emaila"))
    );
  }

  public resetPassword(request: ResetPasswordRequest): Observable<string | null>{
    return this.http.post<unknown>(`${this.url}resetPassword`, request).pipe(
      mapTo(null),
      catchError((error)=>of(error.error ? error.error.info : "Nie udało zmienić hasła"))
    );
  }

}

