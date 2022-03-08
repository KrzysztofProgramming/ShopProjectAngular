import { TypeRequest, ShopProductRequestWithId, GetProductsParams } from '../../models/requests';
import { TypeResponse, TypesResponse } from '../../models/responses';
import { ShopProductRequest } from '../../models/requests';
import { catchError, switchMap, map } from 'rxjs/operators';
import { mapTo } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorResponse, GetProductsResponse } from '../../models/responses';
import { Params } from '@angular/router';
import { ShopProduct } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly url: string = 'http://localhost:8080/api/products/';

  constructor(private http: HttpClient) {  }


  public getAllProducts(queryParams?: GetProductsParams): Observable<GetProductsResponse>{
    return this.http.get<GetProductsResponse>(`${this.url}getAll`, {params: queryParams});
  }

  public getProduct(id: string): Observable<ShopProduct>{
    return this.http.get<ShopProduct>(`${this.url}byId/${id}`);
  }

  public getProducts(ids: string[]): Observable<ShopProduct[]>{
    if(ids.length === 0) return of([]);
    return this.http.get<ShopProduct[]>(`${this.url}byIds`, {params: {"ids": ids}});
  }

  public addProduct(product: ShopProductRequest): Observable<ShopProduct>{
   return this.http.post<ShopProduct>(this.url + "newProduct", product);
  }

  public updateProduct(product: ShopProductRequestWithId): Observable<ShopProduct>{
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

  public downloadProductIcon(id: string): Observable<Blob>{
    return this.http.get(this.getProductIconUrl(id), {responseType: 'blob'});
  }

  public getProductIconUrl(id: string): string{
    return `${this.url}downloadProductIcon/${id}`;
  }

  public deleteProductImage(id: string){
    return this.http.delete(`${this.url}deleteProductImage/${id}`)
  }

  public getTypes(): Observable<TypesResponse>{
    return this.http.get<TypesResponse>(`${this.url}getTypes`);
    // .pipe(
    //   switchMap(response=>{
    //     response.types = response.types.sort((a, b)=>a.localeCompare(b));
    //     return of(response);
    //   })
    // );
  }

  public addType(name: string): Observable<string>{
    const request: TypeRequest = {name: name};
    return this.http.post<TypeResponse>(`${this.url}newType`, request).pipe(
      map(value => value.name)
    );
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
