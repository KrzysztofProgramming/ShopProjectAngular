import { PermsService } from './../../services/http/perms.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles-management',
  templateUrl: './roles-management.component.html',
  styleUrls: ['./roles-management.component.scss']
})
export class RolesManagementComponent implements OnInit {

  constructor(private permsService: PermsService) { }

  ngOnInit(): void {
  }

}
