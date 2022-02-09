import { UsersService } from './../../services/http/users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-users-editor',
  template: `
    <div class="wrapper">
      <div class="filters">
        <span class="p-input-icon-right">
          <i class="pi pi-search"></i>
          <input pInputText>
        </span>
        <shop-roles-select></shop-roles-select>
        <shop-page-select></shop-page-select>
      </div>
    </div>
  `,
  styleUrls: ['./users-editor.component.scss']
})
export class UsersEditorComponent implements OnInit {

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    
  }

}
