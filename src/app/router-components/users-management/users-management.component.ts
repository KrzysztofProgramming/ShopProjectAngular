import { UserRequest } from './../../models/requests';
import { passwordValidators, usernameValidators } from './../../models/shop-validators';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsersService } from './../../services/http/users.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersManagementComponent implements OnInit {

  formGroup: FormGroup = this.fb.group({
    username: ['', usernameValidators],
    email: ['', [Validators.email, Validators.required]],
    password: ['', passwordValidators],
    roles: [[]]
  })
  
  get usernameControl(): AbstractControl{
    return this.formGroup.get("username")!;
  }

  get passwordControl(): AbstractControl{
    return this.formGroup.get("password")!;
  }

  get emailControl(): AbstractControl{
    return this.formGroup.get("email")!;
  }

  get rolesControl(): AbstractControl{
    return this.formGroup.get("roles")!;
  }

  constructor(private usersService: UsersService, private cd: ChangeDetectorRef, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup.valueChanges.subscribe(val=>{
      console.log(this.getRequestModel());
    })
  }

  getRequestModel():UserRequest{
    let value: any = this.formGroup.value;
    value.roles = value.roles.map((role: any)=>role.name); 
    return value; 
  }
}
