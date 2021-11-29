import { animate, state, style, transition, trigger } from '@angular/animations';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';

export interface TreeItem{
  label: string,
  routerLink?: string,
  link?: string,
  items?: TreeItem[]
}


@Component({
  selector: 'shop-tree-menu',
  template: `
    <ng-container *ngFor = "let item of items; let i = index">
      <div class="label" *ngIf = item.routerLink [routerLink]="item.routerLink" (click) = "this.toggle(i)">
        <i *ngIf="item.items" class="pi pi-angle-right" [@rotateIcon] = "this.expandedItems[i] ? 'expanded' : 'collapsed'"></i>
        {{item.label}}
      </div>
      <div class="label" *ngIf = !item.routerLink (click) = "this.toggle(i)">
        <i *ngIf="item.items" class="pi pi-angle-right" [@rotateIcon] = "this.expandedItems[i] ? 'expanded' : 'collapsed'"></i>
        {{item.label}}
      </div>
      <div class="child" 
      *ngIf = "item.items && this.expandedItems[i]"
      @slowExpansion>
        <shop-tree-menu #children [items] = "item.items"></shop-tree-menu>
      </div>
    </ng-container>
  `,
  animations:[
    trigger("slowExpansion",[
      state("void", style({height: 0})),
      state("*", style({height: "*"})),
      transition('* <=> void', animate("400ms ease"))
    ]),
    trigger("rotateIcon", [
      state("expanded", style({transform: "rotate(90deg)"})),
      state("collapsed", style("*")),
      transition("collapsed <=> expanded", animate("400ms ease"))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tree-menu.component.scss']
})
export class TreeMenuComponent {
  
  _items: TreeItem[] = [];
  public expandedItems: boolean[] = [];


  @Input()
  set items(val: TreeItem[]){
    this._items = val;
    this.expandedItems = new Array<boolean>(this._items.length);
    this.expandedItems.fill(false);
    this.cd.markForCheck();
  }
  get items(): TreeItem[]{
    return this._items;
  }

  @ViewChildren("children") children: QueryList<TreeMenuComponent> = new QueryList<TreeMenuComponent>();

  public toggle(index: number){
    this.expandedItems[index] = !this.expandedItems[index];
  }

  public collapseAll(): void{
    this.expandedItems.fill(false);
    this.children.forEach(child=>{
      child.collapseAll();
    })
    this.cd.markForCheck();
  }

  public expandAll(): void{
    this.expandedItems.fill(true);
    this.children.forEach(child=>{
      child.expandAll();
    })
    this.cd.markForCheck();
  }

  constructor(private cd: ChangeDetectorRef) { }


}