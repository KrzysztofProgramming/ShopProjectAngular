import { serverUrl } from './../../models/models';
import { shareReplay, tap } from 'rxjs/operators';
import { GetTypesResponse } from './../../models/responses';
import { TypeRequest, ShopProductRequestWithId, GetProductsParams, GetTypesParams } from '../../models/requests';
import { TypeResponse, TypesResponse } from '../../models/responses';
import { ShopProductRequest } from '../../models/requests';
import { catchError, map } from 'rxjs/operators';
import { mapTo } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorResponse, GetProductsResponse } from '../../models/responses';
import { ShopProduct } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly url: string = `${serverUrl}api/products/`;

  constructor(private http: HttpClient) {  }


  public getAllProducts(queryParams?: GetProductsParams): Observable<GetProductsResponse>{
    return this.http.get<GetProductsResponse>(`${this.url}getAll`, {params: queryParams});
  }

  public getProduct(id: number): Observable<ShopProduct>{
    return this.http.get<ShopProduct>(`${this.url}byId/${id}`);
  }

  public getProducts(ids: number[]): Observable<ShopProduct[]>{
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

  public deleteProduct(id: number){
    return this.http.delete(`${this.url}deleteProduct/${id}`);
  }

  public uploadProductImage(id: number, image: Blob){
    const formData = new FormData();
    formData.append("file", image, id.toString());
    return this.http.put(`${this.url}uploadProductImage/${id}`, formData);
  }

  public downloadProductOriginalImage(id: number): Observable<Blob>{
    return this.http.get(this.getProductOriginalImageUrl(id), {responseType: 'blob'});
  }

  public getProductOriginalImageUrl(id: number): string{
      return `${this.url}downloadProductOriginalImage/${id}`;
  }

  public downloadProductSmallImage(id: number): Observable<Blob>{
    return this.http.get(this.getProductSmallImageUrl(id), {responseType: 'blob'});
  }

  public getProductSmallImageUrl(id: number): string{
      return `${this.url}downloadProductSmallImage/${id}`;
  }

  public downloadProductIcon(id: number): Observable<Blob>{
    return this.http.get(this.getProductIconUrl(id), {responseType: 'blob'});
  }

  public getProductIconUrl(id: number): string{
    return `${this.url}downloadProductIcon/${id}`;
  }

  public deleteProductImage(id: number){
    return this.http.delete(`${this.url}deleteProductImage/${id}`)
  }

  public currentTypeListObservable?: Observable<TypesResponse>

  public getTypes(): Observable<TypesResponse>{
    return this.currentTypeListObservable ||
     (this.currentTypeListObservable =
     this.http.get<TypesResponse>(`${this.url}getTypes`).pipe(
       shareReplay(),
       tap(()=>{
         setTimeout(() => {
           this.currentTypeListObservable = undefined
         }, 10000);
       })
    ));
  }

  public getTypesDetails(params: GetTypesParams): Observable<GetTypesResponse>{
    return this.http.get<GetTypesResponse>(`${this.url}getTypesDetails`, {params: params});
  }

  public updateType(id: number, newName: string): Observable<any>{
    const request: TypeRequest = {name: newName};
    return this.http.put<any>(`${this.url}updateType/${id}`, request);
  }

  public deleteType(id: number): Observable<any>{
    return this.http.delete<any>(`${this.url}deleteType/${id}`);
  }

  public addType(name: string): Observable<TypeResponse>{
    const request: TypeRequest = {name: name};
    return this.http.post<TypeResponse>(`${this.url}newType`, request).pipe();
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
