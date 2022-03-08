import { HttpClient } from '@angular/common/http';
import { ShopOrder } from './../../models/models';
import { Observable } from 'rxjs';
import { NewOrderRequest, PayOrderRequest } from './../../models/requests';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly url = 'http://localhost:8080/api/orders/';
  constructor(private http: HttpClient) { }

  public newOrder(request: NewOrderRequest): Observable<ShopOrder>{
    return this.http.post<ShopOrder>(`${this.url}newOrder`, request);
  }

  public payOrder(request: PayOrderRequest): Observable<unknown>{
    return this.http.put<unknown>(`${this.http}payOrder`, request);
  }
}
