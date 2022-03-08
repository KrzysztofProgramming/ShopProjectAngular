import { ItemModel } from '../multi-selects/abstract-multi-select/abstract-multi-select.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';



interface Item{
  element: ItemModel;
  isSelected: boolean;    
}

@Component({
  selector: 'shop-single-select',
  template: `
 <div class="container">
      <div class="title" [ngClass] = "{'title--expanded': this.expanded}" (click)="this.switchExpanded()">
        <div class="title__header">{{ this.getLabel() }}</div>
        <div class="title__icon" [@iconRotation] = "this.expanded ? 'expanded' : 'collapsed'"><i class="pi pi-angle-left"></i></div>
      </div>
      <div class="animation-wrapper" *ngIf="this.expanded" @smoothExpanding>
        <div class="expansion" #expansion (keydown)="this.handleKeyPress($event)" tabindex="0">
          <div class="expansion__item" *ngFor="let item of this.items; let i = index"
           (click) = "this.onItemSelected(item, i)" >
              <p class="expansion__label" [ngClass]="{'expansion__label--selected': i === this.selectedItemIndex}">
                {{this.getItemLabel(item)}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger("smoothExpanding", [
      state("void", style({ "height": 0, "overflow": "hidden" })),
      state("*", style("*")),
      transition("void <=> *", animate("200ms ease"))
    ]),
    trigger("iconRotation", [
      state("expanded", style({"transform": "rotate(-90deg)"})),
      state("collapsed", style("*")),
      transition("expanded <=> collapsed", animate("200ms ease"))
    ])
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: SingleSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./single-select.component.scss']
})
export class SingleSelectComponent implements OnInit, ControlValueAccessor {
  
  public items: Item[] = [];
  public selectedItemIndex: number = 0;
  public onChangeFn: (item: string)=>void = ()=>{};
  public onToucheFn: ()=>void = ()=>{};
  private _expanded: boolean = false;
  @Output() expandedChange: EventEmitter<boolean> = new EventEmitter();
  @Input() label: string = "Wybierz";
  @Input() displayedProperty: string = "name";
  @Input() modelProperty: string = "code";

  @Input("items")
  set itemsInput(value: ItemModel[]){
    if(value.length === 0) return;
    if(!value || value.length === 0) return;
    this.items = value.map(item=>{return {
      element: item,
      isSelected: false
    };})
    this.items[this.selectedItemIndex].isSelected = true;
    this.cd.markForCheck();
  }
  get itemsInput(): ItemModel[]{
    return this.items.map(item=>item.element);
  }
  
  @Input("expanded")
  set expandedInput(value: boolean) {
    this._expanded = value;
    this.cd.markForCheck();
  }
  get expandedInput(){
    return this._expanded;
  }

  set expanded(value: boolean){
    this._expanded = value;
    this.expandedChange.emit(value);
    this.cd.markForCheck();
  }
  get expanded(): boolean{
    return this._expanded;
  }

  public collapseAllExpansions(){
    
  }

  public switchExpanded(){
    this.expanded = !this.expanded;
    if(!this.expanded){
      this.onToucheFn();
    }
  }

  constructor(private cd: ChangeDetectorRef) { }

  writeValue(value: ItemModel): void {
    this.items.forEach((item, index)=>{
      let matchingItem: Item | null = null;
      if(typeof(item.element) === 'string' && item.element === value){
        matchingItem = item;
      }
      else if(typeof(item.element) !== 'string' && item.element[this.modelProperty] === value){
        matchingItem = item;
      }
      if(!matchingItem) return;
      matchingItem.isSelected = true;
      this.selectedItemIndex = index;
    });
    this.cd.markForCheck();
  }

  public onItemSelected(item: Item, index: number){
    if(index === this.selectedItemIndex) return;
    this.items[this.selectedItemIndex].isSelected = false;
    this.selectedItemIndex = index;
    item.isSelected = true;
    this.callOnChange();
    this.cd.markForCheck();
  }

  public callOnChange(){
    const item = this.items[this.selectedItemIndex];
    this.onChangeFn(typeof(item.element) === 'string' ? item.element : item.element[this.modelProperty]);
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onToucheFn = fn;
  }

  ngOnInit(): void {

  }

  public handleKeyPress(event: KeyboardEvent){
  }

  public getLabel(){
    const selectedItem = this.items[this.selectedItemIndex];
    return selectedItem ? (typeof(selectedItem.element) === 'string') ? selectedItem.element
     : selectedItem.element[this.displayedProperty] : this.label;
  }

  public getItemLabel(item: Item){
    return item ? (typeof(item.element) === 'string') ? item.element
     : item.element[this.displayedProperty] : this.label;
  }

}
