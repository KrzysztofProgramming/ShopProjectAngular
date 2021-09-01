import { ShopProductRequest } from './../models/requests';
import { ShopProduct } from './../models/models';
import { catchError } from 'rxjs/operators';
import { mapTo } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorResponse, GetProductsResponse } from '../models/responses';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly url: string = 'http://localhost:8080/api/products/';

  constructor(private http: HttpClient) {  }


  public getAllProducts(queryParams?: Params): Observable<GetProductsResponse>{
    return this.http.get<GetProductsResponse>(`${this.url}getAll`, {params: queryParams});
  }

  public getProduct(id: string): Observable<ShopProduct>{
    return this.http.get<ShopProduct>(`${this.url}byId/${id}`);
  }

  public addProduct(product: ShopProductRequest): Observable<ShopProduct>{
   return this.http.post<ShopProduct>(this.url + "addNewProduct", product);
  }

  public updateProduct(product: ShopProduct): Observable<ShopProduct>{
    if(product.id == null) throw(`Product: ${product} has no id`);
    return this.http.put<ShopProduct>(`${this.url}updateProduct/${product.id}`, product, {headers: {}});
  }

  public deleteProduct(id: string){
    return this.http.delete(`${this.url}deleteProduct/${id}`);
  }

  public uploadProductImage(id: string, image: Blob){
    const formData = new FormData();
    formData.append("file", image, id);
    return this.http.put(`${this.url}uploadProductImage/${id}`, formData);
  }

  public downloadProductImage(id: string): Observable<Blob>{
    return this.http.get(this.getProductImageUrl(id), {responseType: 'blob'});
  }

  public getProductImageUrl(id: string): string{
      return `${this.url}downloadProductImage/${id}`;
  }

  public deleteProductImage(id: string){
    return this.http.delete(`${this.url}deleteProductImage/${id}`)
  }

  public testApi(): Observable<boolean>{
    return this.http.get<ErrorResponse>(this.url + "test").pipe(
      mapTo(true),
      catchError(() =>{
        return of(false);
      })
    );
  }
}
