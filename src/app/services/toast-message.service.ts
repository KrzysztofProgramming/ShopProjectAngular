import { Injectable } from '@angular/core';
import { Message } from 'primeng/api';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {
  
  private actualMessage: Subject<Message> = new Subject();

  public observeMessages(): Observable<Message>{
      return this.actualMessage;
  }

  public showMessage(message: Message){
    this.actualMessage.next(message)
  }

  constructor() { }
}
