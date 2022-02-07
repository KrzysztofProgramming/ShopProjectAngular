import { map } from 'rxjs/operators';
import { RoleRequest } from './../../models/requests';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Role } from 'src/app/models/models';

@Injectable({
  providedIn: 'root'
})
export class PermsService {
  private readonly url: string = 'http://localhost:8080/api/perms/';

  constructor(private http: HttpClient) { }

  public getRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(`${this.url}roles`).pipe()
  }

  public createRole(request: RoleRequest): Observable<Role>{
    return this.http.post<Role>(`${this.url}newRole`, request);
  }

  public updateRole(request: RoleRequest): Observable<Role>{
    return this.http.put<Role>(`${this.url}updateRole/${request.name}`, request);
  }

  public deleteRole(roleName: string): Observable<unknown>{
    return this.http.delete<unknown>(`${this.url}deleteRole/${roleName}`);
  }
}
