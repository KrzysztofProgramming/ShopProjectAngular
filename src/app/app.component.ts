import { ToastMessageService } from './services/utils/toast-message.service';
import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService]
})
export class AppComponent {
  title = 'ShopProject';

  constructor(private toastInfoService: ToastMessageService, private messageService: MessageService){
     toastInfoService.observeMessages().subscribe(message =>{
       messageService.add(message);
     })
  }
}
