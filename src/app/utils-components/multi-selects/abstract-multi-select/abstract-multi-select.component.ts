import { preserveWhitespacesDefault } from '@angular/compiler';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'shop-multi-select-item',
  template: ` `,
  styles: []
})
export class AbstractListItemComponent {
  @Input() element: string | ItemModel = "";
  @Input() displayProperty: string = "name";
  private _isChecked: boolean = false;
  private _isHighlighted: boolean = false;
  private _isDisabled: boolean = false;

  @Input()
  set isHighlighted(value: boolean) {
    this._isHighlighted = value;
  }
  get isHighlighted(): boolean {
    return this._isHighlighted;
  }

  @Input()
  set isChecked(value: boolean) {
    this._isChecked = value;
  }
  get isChecked(): boolean {
    return this._isChecked;
  }

  @Input()
  set isDisabled(value: boolean){
    this._isDisabled = value;
  }
  get isDisabled(): boolean{
    return this._isDisabled;
  }

  constructor(public eref: ElementRef<HTMLElement>) { }

  public getLabel(): string{
    return typeof(this.element) === "string" ? this.element : this.element[this.displayProperty];
  }
}

export type ItemModel = string | 
{
  [key: string]: any
};

export interface ItemOptions {
  element: ItemModel;
  isChecked: boolean;
  isDisplay: boolean;
  displayItemsIndex?: number;
  allItemsIndex: number;
}

@Component({
  selector: 'shop-abstract-editable-list',
  template: ``,
  styles: []
})
export class AbstractMultiSelectComponent implements OnInit, OnDestroy {
  @Input() sort: boolean = true;
  @Input() label: string = "Wybierz";
  @Input() labelOverflowSize: number = 3;
  @Input() invalid: boolean = false;
  @Input() displayProperty: string = "name";
  @Input() modelProperty?: string;
  @Input() disableProperty: string = "disabled"; 
  @Input() waitingForDataFlag: boolean = false;
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  

  public selectedItemsString: string = "";
  public allItems: ItemOptions[] = [];
  public displayItems: ItemOptions[] = [];
  public checkedItems: ItemOptions[] = [];
  public currentFilter: string = "";
  public groupChecked: boolean = false;
  public onChangeFunction: (items: ItemModel[])=>void = () => {};
  public onTouchedFunction: ()=>void = () => {};
  public filterChange: Subject<string> = new Subject();
  protected subscriptions: Subscription[] = [];
  protected _highlightedItem?: ItemOptions;
  protected previouslyHighlightedItem? :ItemOptions;
  private _expanded: boolean = false;
  protected clickCooldown: number = 100;
  private lastKeyCode: string = "";
  private lastClickedTime: number = 0;
  private preSelectedItems: ItemModel[] = [];

  get highlightedItem(): ItemOptions | undefined{
    return this._highlightedItem;
  }
  set highlightedItem(value: ItemOptions | undefined){
    if(value === this._highlightedItem) return;
    this.previouslyHighlightedItem = this._highlightedItem;
    this._highlightedItem = value;
  }

  @Input()
  set items(items: ItemModel[]) {
    // items = new Array(1000).fill(0).map(()=>(Math.random() * 10 + 1).toString(36).substring(2));
    let checkedItemsString :Array<string> = this.checkedItems.map(item=>{
      return typeof(item.element) === 'string' ? item.element : item.element[this.displayProperty]});
      console.log("checked items", checkedItemsString);
    this.allItems = items.map((item, index) =>
     {return {element: item,
       isDisplay: false,
       isChecked: checkedItemsString.includes(typeof(item) === 'string' ? item : item[this.displayProperty]),
       allItemsIndex: index,
      }});
    if(this.sort) this.sortItems();
    if(this.preSelectedItems.length > 0){
      this.writeValue(this.preSelectedItems);
      this.preSelectedItems = [];
      return;
    }
    this.calcDisplayItems();
    this.calcCheckedItems();
    this.refreshDisplayInfo();
  }

  sortItems(): void{
    this.allItems.sort((a, b)=>{
      const stringA: string = typeof(a.element) === 'string' ? a.element : a.element[this.displayProperty];
      const stringB: string = typeof(b.element) === 'string' ? b.element : b.element[this.displayProperty];
      return stringA.localeCompare(stringB);
    })
    this.allItems.forEach((item, index)=>item.allItemsIndex = index);
  }

  calcDisplayItems(): void{
    this.displayItems = this.allItems
      .filter(item => item.isDisplay = this.matchFilter(item.element));
    this.displayItems.forEach((item, index)=>item.displayItemsIndex = index);
  }

  public calcCheckedItems(){
    this.checkedItems = this.allItems.filter(item=>item.isChecked);
  }

  @Input("expanded")
  set expandedInput(value: boolean){
    this._expanded = value;
    this.onExpandedChange(value);
    this.cd.markForCheck();
  }
  get expandedInput(): boolean{
    return this._expanded;
  }
  
  @Output("expandedChange")
  expandedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  set expanded(value: boolean) {
    this._expanded = value;
    this.onExpandedChange(value);
    this.expandedChange.emit(this._expanded);
    this.cd.markForCheck();
  }

  get expanded(): boolean {
    return this._expanded;
  }

  constructor(protected eref: ElementRef<HTMLElement>, protected cd: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.filterChange.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(this.calcFilterChange.bind(this))
    )
  }

  writeValue(obj: ItemModel[]): void {
    if(!obj) obj =[];
    obj = obj.slice();
    if(this.allItems.length === 0){
      this.preSelectedItems = obj;
      return;
    }
    console.log("writeValue:", obj, this.allItems);
    this.allItems.forEach(item => {
      if(typeof(item.element)==="string"){
        item.isChecked = obj.includes(item.element);
      }
      else if(this.modelProperty){
        item.isChecked = obj.includes(item.element[this.modelProperty]);
      }
      else{
        item.isChecked = obj.some(selectedItem=>{
          return (item.element as any)[this.displayProperty] === (selectedItem as any)[this.displayProperty];
        })
      }
    });
    this.calcDisplayItems();
    this.calcCheckedItems();
    this.refreshDisplayInfo();
    this.cd.markForCheck();
  }
  
  registerOnChange(fn: (items: ItemModel[])=>void): void {
    this.onChangeFunction = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFunction = fn;
  }

  public switchExpanded(): void {
    this.expanded = !this.expanded;
    this.checkForTouched();
    this.cd.markForCheck();
  }

  protected checkForTouched() {
    if (!this.expanded) {
      this.onTouchedFunction();
      this.blur.emit();
    }
  }

  public onItemClick(item: ItemOptions) {
    this.switchItemChecked(item);
  }

  public switchItemChecked(item: ItemOptions){
    if(typeof(item.element)==='object' && item.element[this.disableProperty]) return;
    item.isChecked = !item.isChecked;
    if(!item.isChecked){
      this.checkedItems.splice(this.checkedItems.indexOf(item), 1);
    }
    else{
      const size: number = this.checkedItems.push(item);
    }
    this.highlightedItem = item;
    this.onItemCheckedChange();
  }

  public isItemDisabled(item: ItemModel){
    if(typeof(item) === 'string')
      return false;
    return item[this.disableProperty];
  }

  protected onItemCheckedChange(){
    this.refreshDisplayInfo();
    this.cd.markForCheck();
    this.callOnChangeFn();
  }

  public callOnChangeFn(){
    if(this.modelProperty)
      this.onChangeFunction(this.checkedItems.map(item=>((item.element as {[key:string]: any})[this.modelProperty!])));
    else
      this.onChangeFunction(this.checkedItems.map(item=>item.element));
  }

  public onExpandedChange(currentValue: boolean) {
    if (currentValue)
      this.focusInput();
  }

  public onFilterChange() {
    this.filterChange.next(this.currentFilter);
  }

  protected calcFilterChange(){
    this.calcDisplayItems();
    this.refreshDisplayInfo();
  }
  public refreshDisplayInfo() {
    if (this.checkedItems.length === 0) this.selectedItemsString = "";
    else this.selectedItemsString = `${this.checkedItems.length} zaznaczeń`;

    this.groupChecked = this.displayItems.length > 0
    && this.displayItems.every(item => item.isChecked);

    this.cd.markForCheck();
  }

  public onGroupCheckClicked() {
    this.displayItems.forEach(item => item.isChecked = this.groupChecked);
    this.calcCheckedItems();
    this.refreshDisplayInfo();
    this.callOnChangeFn();
  }

  // private isAllChecked(): boolean {
  //   return !this.allItems.some(item => !item.isChecked);
  // }

  protected matchFilter(value: ItemModel): boolean {
    if(typeof(value) === "string")
      return value.search(new RegExp(this.currentFilter, 'i')) != -1;
    return value[this.displayProperty].search(new RegExp(this.currentFilter, 'i')) != -1;
  }

  public handleKeyPress(event: KeyboardEvent) {
    const keyCode = event.code;
    if (!["Enter", "ArrowUp", "ArrowDown"].includes(keyCode)) return;
    event.preventDefault();
    event.stopPropagation();
    this.focusExpansion();
      
    const time = new Date().getTime();
    if(this.lastClickedTime + this.clickCooldown >= time && keyCode === this.lastKeyCode) return;
    this.lastClickedTime = time;
    this.lastKeyCode = keyCode;

    switch (keyCode) {
      case "Enter": {
        if(!this.highlightedItem) return;
        this.switchItemChecked(this.highlightedItem);
        break;
    }

      case "ArrowUp":
        {
          do{
            const index: number = this.highlightedItem?.displayItemsIndex || 0;
            if (index === 0) {
              this.highlightedItem = undefined;
              this.focusInput();
              // this.highlightedItem = undefined;
              break;
            };
            this.highlightedItem = this.displayItems[index - 1];
          }while(this.isItemDisabled(this.highlightedItem.element));

          break;
        }

      case "ArrowDown": {
        do{
          if (!this.highlightedItem && this.displayItems.length > 0) {
            this.highlightedItem = this.displayItems[0];
            this.unfocusInput();
          }
          else{
            const index: number = this.highlightedItem?.displayItemsIndex || 0;
            if (index >= this.displayItems.length - 1) return;
            this.highlightedItem = this.displayItems[index + 1];
          }
        }while(this.isItemDisabled(this.highlightedItem.element));
        break;
      }
      default: {
        return;
      }
    }
    this.cd.markForCheck();
    if(!this.highlightedItem) return;
    this.scrollToItemIfOverflowing(this.highlightedItem);
  }

  public isHighlighted(itemValue: ItemOptions): boolean {
    return itemValue.element === this.highlightedItem?.element;
  }

  public focusInput(): void {}

  public unfocusInput(): void {}

  public scrollToItemIfOverflowing(item: ItemOptions): void {}

  public focusExpansion(): void {}

  public isItemOverflowing(elementRef: HTMLElement): void {}

}
