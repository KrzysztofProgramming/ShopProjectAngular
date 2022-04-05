import { debounceTime, shareReplay, tap } from 'rxjs/operators';
import { Author } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { GetAuthorsResponse, SimpleAuthorsResponse } from 'src/app/models/responses';
import { AuthorRequest } from 'src/app/models/requests';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

  private readonly url: string = 'http://localhost:8080/api/authors/';
  constructor(private http: HttpClient) { }
  currentSimpleListObservable?: Observable<SimpleAuthorsResponse>

  public getSimpleAuthors(): Observable<SimpleAuthorsResponse>{
    return this.currentSimpleListObservable ||
      (this.currentSimpleListObservable = this.http.get<SimpleAuthorsResponse>(`${this.url}getSimpleList`).pipe(
        shareReplay(),
        tap(()=>{setTimeout(() => {
          this.currentSimpleListObservable = undefined
        }, 10000);})
    ))
  }

  public getAuthors(authorsParams: Params): Observable<GetAuthorsResponse>{
    return this.http.get<GetAuthorsResponse>(`${this.url}getAll`, {params: authorsParams});
  }

  public getAuthorById(id: string): Observable<Author>{
    return this.http.get<Author>(`${this.url}byId/${id}`);
  }

  public deleteAuthorById(id: string){
    return this.http.delete(`${this.url}deleteAuthor/${id}`);
  }

  public newAuthor(request: AuthorRequest): Observable<Author>{
    return this.http.post<Author>(`${this.url}newAuthor`, request);
  }

  public updateAuthor(id: string, request: AuthorRequest): Observable<Author>{
    return this.http.put<Author>(`${this.url}updateAuthor/${id}`, request);
  }

}
