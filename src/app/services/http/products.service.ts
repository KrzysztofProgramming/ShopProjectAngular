import { ShopProductRequest } from '../../models/requests';
import { ShopProductWithId } from '../../models/models';
import { catchError } from 'rxjs/operators';
import { mapTo } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorResponse, GetProductsResponse } from '../../models/responses';
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

  public getProduct(id: string): Observable<ShopProductWithId>{
    return this.http.get<ShopProductWithId>(`${this.url}byId/${id}`);
  }

  public getProducts(ids: string[]): Observable<ShopProductWithId[]>{
    if(ids.length === 0) return of([]);
    return this.http.get<ShopProductWithId[]>(`${this.url}byIds`, {params: {"ids": ids}});
  }

  public addProduct(product: ShopProductRequest): Observable<ShopProductWithId>{
   return this.http.post<ShopProductWithId>(this.url + "newProduct", product);
  }

  public updateProduct(product: ShopProductWithId): Observable<ShopProductWithId>{
    if(product.id == null) throw(`Product: ${product} has no id`);
    return this.http.put<ShopProductWithId>(`${this.url}updateProduct/${product.id}`, product, {headers: {}});
  }

  public deleteProduct(id: string){
    return this.http.delete(`${this.url}deleteProduct/${id}`);
  }

  public uploadProductImage(id: string, image: Blob){
    const formData = new FormData();
    formData.append("file", image, id);
    return this.http.put(`${this.url}uploadProductImage/${id}`, formData);
  }

  public downloadProductOriginalImage(id: string): Observable<Blob>{
    return this.http.get(this.getProductOriginalImageUrl(id), {responseType: 'blob'});
  }

  public getProductOriginalImageUrl(id: string): string{
      return `${this.url}downloadProductOriginalImage/${id}`;
  }

  public downloadProductSmallImage(id: string): Observable<Blob>{
    return this.http.get(this.getProductSmallImageUrl(id), {responseType: 'blob'});
  }

  public getProductSmallImageUrl(id: string): string{
      return `${this.url}downloadProductSmallImage/${id}`;
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
