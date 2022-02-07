import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Permission, Permissions } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'shop-perms-select',
  template: `
    <shop-dropdown-multi-select [items]="this.allPerms" [(ngModel)] = "this.model"
     (ngModelChange)="this.onChangeFn($event)" (blur) = "this.onTouchedFn()"></shop-dropdown-multi-select>
  `,
  providers:[{
      provide: NG_VALUE_ACCESSOR,
      useExisting: PermsSelectComponent,
      multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./perms-select.component.scss']
})
export class PermsSelectComponent implements OnInit, ControlValueAccessor {

  public model: Permission[] = [];
  public allPerms: Permission[] = []
  public onChangeFn: any = ()=>{};
  public onTouchedFn: any = ()=>{};
  constructor(private cd: ChangeDetectorRef) {}

  writeValue(obj: any): void {
    this.model = obj;
    this.cd.markForCheck();
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  ngOnInit(): void {
    this.allPerms = Permissions.asArray();
    this.cd.markForCheck();
  }

}
