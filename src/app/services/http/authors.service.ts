import { debounceTime, shareReplay, tap } from 'rxjs/operators';
import { Author, serverUrl } from '../../models/models';
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

  private readonly url: string = `${serverUrl}api/authors/`;
  constructor(private http: HttpClient) { }

  currentSimpleListObservable?: Observable<SimpleAuthorsResponse>
  private lastTimeout?: any;

  public getSimpleAuthors(force: boolean = false): Observable<SimpleAuthorsResponse>{
    return force && this.currentSimpleListObservable ? this.currentSimpleListObservable
     : (this.currentSimpleListObservable = this.downloadAuthors());
  }

  private downloadAuthors(): Observable<SimpleAuthorsResponse>{
    return this.currentSimpleListObservable = this.http.get<SimpleAuthorsResponse>(`${this.url}getSimpleList`).pipe(
      shareReplay(),
      tap(()=>{
        if(this.lastTimeout) clearTimeout(this.lastTimeout)
        this.lastTimeout = setTimeout(() => {
          this.currentSimpleListObservable = undefined
      }, 10000);})
  )
  }

  public getAuthors(authorsParams: Params): Observable<GetAuthorsResponse>{
    return this.http.get<GetAuthorsResponse>(`${this.url}getAll`, {params: authorsParams});
  }

  public getAuthorById(id: number): Observable<Author>{
    return this.http.get<Author>(`${this.url}byId/${id}`);
  }

  public deleteAuthorById(id: number){
    return this.http.delete(`${this.url}deleteAuthor/${id}`);
  }

  public newAuthor(request: AuthorRequest): Observable<Author>{
    return this.http.post<Author>(`${this.url}newAuthor`, request);
  }

  public updateAuthor(id: number, request: AuthorRequest): Observable<Author>{
    return this.http.put<Author>(`${this.url}updateAuthor/${id}`, request);
  }

}
