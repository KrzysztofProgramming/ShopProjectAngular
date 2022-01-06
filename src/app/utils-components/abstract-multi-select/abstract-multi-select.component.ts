import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  constructor(public eref: ElementRef<HTMLElement>) { }

  public getLabel(): string{
    return typeof(this.element) === "string" ? this.element : this.element[this.displayProperty];
  }
}

export type ItemModel = string | {[key: string]: any};

export interface ItemOptions {
  element: ItemModel;
  isChecked: boolean;
  isDisplay: boolean;
  displayItemsIndex?: number;
  checkedItemsIndex?: number;
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
  @Input() editable: boolean = true;
  @Input() displayProperty: string = "name";
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
    this.allItems = items.map((item, index) =>
     {return {element: item,
       isDisplay: false,
       isChecked: false,
       allItemsIndex: index,
      }});
    if(this.sort) this.sortItems();
    this.calcDisplayItems();
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
    this.checkedItems.forEach((item, index)=>item.checkedItemsIndex = index);
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
    if(!obj) return;
    // console.log();
    obj = new Array(...obj);

    this.allItems.forEach(item => {
      if(typeof(item.element)==="string"){
        item.isChecked = obj.includes(item.element);
      }
      else{
        item.isChecked = obj.some(selectedItem=>{
          return (item.element as any)[this.displayProperty] === (selectedItem as any)[this.displayProperty];
        })
      }
    });
    this.calcDisplayItems();
    this.calcCheckedItems();
    this.onChange(false);
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
    item.isChecked = !item.isChecked;
    if(!item.isChecked){
      this.checkedItems.splice(item.checkedItemsIndex!, 1);
      item.checkedItemsIndex = undefined;
    }
    else{
      this.checkedItems.push(item);
      item.checkedItemsIndex = this.checkedItems.length - 1; 
    }
    this.highlightedItem = item;
    this.onItemCheckedChange();
  }

  protected onItemCheckedChange(){
    this.refreshDisplayInfo();
    // console.log("refreshing display info: ", this.groupChecked);
    this.cd.markForCheck();
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

  // public calcAfterFilterChanged(){
  //   this.allItems.forEach(item=>{
  //     item.isDisplay = this.matchFilter(item);
  //   })
  //   this.calcDisplayItems();
  // }

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
    this.onChange();
  }

  // private isAllChecked(): boolean {
  //   return !this.allItems.some(item => !item.isChecked);
  // }

  protected onChange(triggerEvent: boolean = true) {
    this.refreshDisplayInfo();
    if(triggerEvent) { this.onChangeFunction(this.checkedItems.map(item=>item.element))};
  }

  protected matchFilter(value: ItemModel): boolean {
    if(typeof(value) === "string")
      return value.search(new RegExp(this.currentFilter, 'i')) != -1;
    return value[this.displayProperty].search(new RegExp(this.currentFilter, 'i')) != -1;
  }

  public handleKeyPress(event: KeyboardEvent) {
    const keyCode = event.code;
    // console.log(keyCode);
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
        this.onChange(true);
        break;
      }

      case "ArrowUp":
        {
          const index: number = this.highlightedItem?.displayItemsIndex || 0;
          if (index === 0) {
            this.highlightedItem = undefined;
            this.focusInput();
            // this.highlightedItem = undefined;
            break;
          };
          this.highlightedItem = this.displayItems[index - 1];
          break;
        }

      case "ArrowDown": {
        if (!this.highlightedItem && this.displayItems.length > 0) {
          this.highlightedItem = this.displayItems[0];
          this.unfocusInput();
          break;
        }
        const index: number = this.highlightedItem?.displayItemsIndex || 0;
        if (index >= this.displayItems.length - 1) return;
        this.highlightedItem = this.displayItems[index + 1];
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
