import { ProfileInfo } from '../../models/models';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { UpdatePasswordRequest, UpdateProfileRequest } from '../../models/requests';

@Injectable({
  providedIn: 'root'
})
export class ProfileInfoService {
  private readonly url: string = 'http://localhost:8080/api/users/profile/';

  constructor(private http: HttpClient){}


  public getProfileInfo():Observable<ProfileInfo>{
    return this.http.get<ProfileInfo>(`${this.url}info`);
  }

  public updateProfileInfo(info: UpdateProfileRequest):Observable<ProfileInfo>{
    return this.http.put<ProfileInfo>(`${this.url}update`, info);
  }
  
  public updatePassword(request: UpdatePasswordRequest): Observable<any>{
    return this.http.put(`${this.url}updatePassword`, request);
  }
}
