import { GetOrdersResponse } from './../../models/responses';
import { PageableParams, GetOrdersParams } from './../../models/requests';
import { ShopOrder, UserInfo } from './../../models/models';
import { ProfileInfo } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UpdateEmailRequest, UpdatePasswordRequest } from '../../models/requests';

@Injectable({
  providedIn: 'root'
})
export class ProfileInfoService {
  private readonly url: string = 'http://localhost:8080/api/users/profile/';

  constructor(private http: HttpClient){}


  public getProfileInfo():Observable<ProfileInfo>{
    return this.http.get<ProfileInfo>(`${this.url}info`);
  }

  public updateEmail(info: UpdateEmailRequest):Observable<ProfileInfo>{
    return this.http.put<ProfileInfo>(`${this.url}updateEmail`, info);
  }
  
  public updatePassword(request: UpdatePasswordRequest): Observable<any>{
    return this.http.put(`${this.url}updatePassword`, request);
  }

  public updateUserInfo(info: UserInfo): Observable<any>{
    return this.http.put(`${this.url}updateUserInfo`, info);
  }

  public getOrders(params: GetOrdersParams): Observable<GetOrdersResponse>{
    return this.http.get<GetOrdersResponse>(`${this.url}orders`, {params: params});
  }

  public getOrder(id: string):Observable<ShopOrder>{
    return this.http.get<ShopOrder>(`${this.url}order/${id}`);
  }
}
