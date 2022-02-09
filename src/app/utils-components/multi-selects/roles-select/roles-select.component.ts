import { AuthService } from '../../../services/auth/auth.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PermsService } from '../../../services/http/perms.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/models/models';

export interface RoleElement extends Role{
  disabled? : boolean;
}

@Component({
  selector: 'shop-roles-select',
  template: `
    <shop-dropdown-multi-select [items]="this.roles" displayProperty="name" [(ngModel)] = "this.model" [sort] = "false"
    (ngModelChange)="this.onChangeFn($event)" (blur) = "this.onTouchedFn()"[invalid]="this.invalid"></shop-dropdown-multi-select>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: RolesSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./roles-select.component.scss']
})
export class RolesSelectComponent implements OnInit, OnDestroy, ControlValueAccessor {
  
  @Input() invalid: boolean = false;

  constructor(private permsService: PermsService, private authService: AuthService, private cd: ChangeDetectorRef) { }

  writeValue(obj: any): void {
    this.model = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;    
  }

  private subscriptions: Subscription[] = [];
  public roles: RoleElement[] = [];
  public model: RoleElement[] = [];
  public onChangeFn: any = ()=>{};
  public onTouchedFn: any = ()=>{};
  public disableHigherRoles: boolean = true;


  ngOnInit(): void {
    this.refreshRoles();
  }

  public refreshRoles(){
    this.subscriptions.push(
      this.authService.rolesChange.subscribe(usersRoles=>{
        if(usersRoles.length === 0 )return;
        this.permsService.getRoles().subscribe(roles=>{
          this.roles = roles;
          if(!this.disableHigherRoles) return;
          let highestRole = this.highestRole(usersRoles);
          this.roles.forEach(role=>{
            role.disabled = role.order <= highestRole.order && highestRole.order !== 0;
          })
          console.log(this.roles);
          this.cd.markForCheck();
        })
      })
    )
  }

  private highestRole(roles: Role[]){
    return roles.reduce((previous, current)=> previous.order < current.order ? previous : current);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }
}
