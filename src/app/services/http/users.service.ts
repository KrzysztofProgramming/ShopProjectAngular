import { GetUsersResponse } from './../../models/responses';
import { ShopUser } from './../../models/models';
import { Observable } from 'rxjs';
import { UserRequest, GetUsersParams } from './../../models/requests';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly url = "http://localhost:8080/api/users/";

  constructor(private http: HttpClient) { }

  public getUserByUsername(username: string): Observable<ShopUser>{
    return this.http.get<ShopUser>(`${this.url}byUsername/${username}`);
  }

  public getByParams(params?: GetUsersParams): Observable<GetUsersResponse>{
    return this.http.get<GetUsersResponse>(`${this.url}getAll`, {params: params});
  }

  public newUser(request: UserRequest): Observable<ShopUser>{
    return this.http.post<ShopUser>(`${this.url}newUser`, request);
  }

  public updateUser(request: UserRequest): Observable<ShopUser>{
    return this.http.put<ShopUser>(`${this.url}updateUser`, request);
  }

  public deleteUser(username: string): Observable<unknown>{
    return this.http.delete<unknown>(`${this.url}deleteUser/${username}`);
  }
}
