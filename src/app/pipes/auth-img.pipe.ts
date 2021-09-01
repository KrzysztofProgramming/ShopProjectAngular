import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map, tap, catchError } from 'rxjs/operators';

@Pipe({
  name: 'authImg'
})
export class AuthImgPipe implements PipeTransform {
  
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}
  private link: string = "../../assets/img/empty-image.png";

  transform(url: string): Observable<SafeUrl> {
    return this.http
      .get(url, {responseType: 'blob'}).pipe(
        map(blob => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))),
        catchError(()=>{
          return of(this.link);
        })
      )
  }

}
