import { HttpClient } from '@angular/common/http';
import { serverUrl, ShopOrder } from './../../models/models';
import { Observable } from 'rxjs';
import { NewOrderRequest, PayOrderRequest } from './../../models/requests';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly url = `${serverUrl}api/orders/`;
  constructor(private http: HttpClient) { }

  public newOrder(request: NewOrderRequest): Observable<ShopOrder>{
    return this.http.post<ShopOrder>(`${this.url}newOrder`, request);
  }

  public payOrder(id: string): Observable<unknown>{
    let request: PayOrderRequest = {id: id};
    return this.http.put<unknown>(`${this.url}payOrder`, request);
  }
}
