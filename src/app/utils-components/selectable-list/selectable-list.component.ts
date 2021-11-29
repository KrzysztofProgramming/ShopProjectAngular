import { state, style, trigger, transition, animate } from '@angular/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

export interface ListElement{
  label: string;
  rightIcon?: string;
  leftIcon?: string;
  routerLink?: string;
  isChecked?: boolean;
}

@Component({
  selector: 'shop-selectable-list',
  template: `
    <div class="list">
      <div class="list__header" (click)="this.setExpanded(!this.expanded); this.checkForTouche();">
          <p class="list__header-title">{{listTitle}}</p>
          <i class="pi pi-angle-left" [@expandRotation] = "this.expanded ? 'expanded' : 'collapsed'"></i>
      </div>
      <div class="list__animation-wrapper"  *ngIf = "this.expanded" @expanding>
        <div class="list__content">
          <div class="list__check-all list__element" (click) = "this.setCheckedAll(!this.checkedAll)">
            <shop-checkbox [switchable] = "false" class=list__check-all-checkbox [ngModel] ="this.checkedAll"></shop-checkbox>
          </div>
          <div class="list__elements">
            <div class="list__element" *ngFor = "let item of list; let i = index"
              [class.list__element--selected] = "item.isChecked"
             (click)="this.onItemClicked(item, i)">
              <shop-checkbox *ngIf = "this.selectable" class="list__element__switcher" [switchable] = "false" [(ngModel)] = "this.item.isChecked"></shop-checkbox>
              <i *ngIf = "item.leftIcon" class="list__icon-left pi {{item.leftIcon}}"></i>
              <p>{{item.label}}</p>
              <i *ngIf = "item.rightIcon" class="list__icon-right pi {{item.rightIcon}}"></i>
            </div>
          <div>
        <div>
      </div>
    </div>
  `,
  styleUrls: ['./selectable-list.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: SelectableListComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger("expanding", [
      state("*", style("*")),
      state("void", style({height: 0})),
      transition("void <=> *", animate("300ms ease"))
    ]),
    trigger("expandRotation", [
      state("expanded", style({transform: 'rotate(-90deg)'})),
      state("collapsed", style("*")),
      transition("expanded <=> collapsed", animate("300ms ease"))
    ])
  ]
})
export class SelectableListComponent implements OnInit, ControlValueAccessor {

  @Input() expanded: boolean = false;
  @Input() listTitle: string = "";
  @Input() selectable: boolean = true;
  @Output() expandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public list: ListElement[] = [];

  public checkedAll: boolean = false;

  private onChangeFn: any = () =>{};
  private onTouchedFn: any = () =>{};

  @Input()
  set items(value: ListElement[]){
    this.list = value.map(item =>{
      if(item.isChecked == undefined){
          item.isChecked = false;
      }
      return item;
    });
    this.checkSelectAll();
    this.cd.markForCheck();
  }
  get items(): ListElement[]{
    return this.list;
  }

  public setExpanded(value: boolean){
    if(value === this.expanded) return;
    this.expanded = value;
    this.expandedChange.emit(value);
    this.cd.markForCheck();
  }

  public onItemClicked(item: ListElement, index: number){
    if(item.routerLink){
      this.router.navigateByUrl(item.routerLink);
      return;
    };
    item.isChecked = !item.isChecked;
    this.onChangeFn(this.getCheckedItems());
    this.checkSelectAll();
    this.cd.markForCheck();
  }

  public getCheckedItems(): string[]{
    let checkedList: string[] = [];
    this.list.forEach(item =>{
      if(item.isChecked)
        checkedList.push(item.label);
    });
    return checkedList;
  }

  ngOnInit(): void {
    
  }

  constructor(public router: Router, private cd: ChangeDetectorRef) { }

  writeValue(obj: string[]): void {
    if(!obj){
      this.list = this.list.map(item=>{
        item.isChecked = false;
        return item;
      })
      return;
    }
    this.list = this.list.map(item=>{
      item.isChecked = obj.includes(item.label);
      return item;
    })
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  checkForTouche(){
    if(this.expanded)
      this.onTouchedFn();
  }

  public checkSelectAll(){
    this.checkedAll = this.list.every(item=>item.isChecked);
    this.cd.markForCheck();
  }

  public checkAll(){
    this.checkedAll = true;
    this.list = this.list.map(item => {item.isChecked = true; return item});
    this.cd.markForCheck();
  }

  public uncheckAll(){
    this.checkedAll = false;
    this.list = this.list.map(item => {item.isChecked = false; return item});
    this.cd.markForCheck();
  }

  public setCheckedAll(value: boolean){
    if(value===this.checkedAll) return;
    if(value) this.checkAll();
    else this.uncheckAll();
    this.onChangeFn(this.getCheckedItems());
  }

}
