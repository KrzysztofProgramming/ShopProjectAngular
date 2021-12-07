import { distinctUntilChanged } from 'rxjs/operators';
import { ProductDetailsComponent } from './../../router-components/product-details/product-details.component';
import { BehaviorSubject } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ElementRef, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'shop-multi-select-item',
  template: `
    <div class="content" (click) = "this.triggerOnClick()" [class.selected] = "this.isChecked" [class.highlighted] = "this.isHighlighted">
        <p-checkbox #checkbox [readonly] = "true" [ngModel] = "this.isChecked" class="checkbox" [binary] = "true"></p-checkbox>
        <div class="label"> {{label}} </div>
    </div>
  `,
  styles: [
    `
    @import "../../../styling/all.scss";

    :host{
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 32px;
    }

    .content{
      height: 32px;
      padding: 0 4px 0 4px;
      margin: 0 2px 0 2px;
      display: flex;
      flex-direction: row;
      align-items: center;
      transition-duration: 150ms;
      border-radius: 3px;
      cursor: pointer;
      transition-duration: 150ms;

      &:hover{
        background-color: $theme-border;
      }
    }

    .highlighted{
      box-shadow: 0 0 4px 3px $theme-color;
      z-index: 1;
    }

    .selected{
      background-color: $theme-color-light-3 !important;

      &:hover{
        background-color: $theme-color-light-2 !important;
      }
    }

    .label{
      flex: 1;
      margin-left: 10px;
      white-space: nowrap;
    }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiSelectItemComponent  {
  @Input() label: string = "";
  private _isChecked: boolean = false;
  private _isHighlighted: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter();

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



  public triggerOnClick(): void {
    this.onClick.emit();
  }

}

interface ItemOptions {
  label: string;
  isChecked: boolean;
  isDisplay: boolean;
  isAdded: boolean;
  // isHighlighted: boolean;
}


@Component({
  selector: 'shop-editable-multi-select',
  template: `
    <div class="content">
      <div class="top" (click) = "this.switchExpanded()" [class.top--invalid] = "this.invalid">
          <input class="top__input-label" readonly='true' [value] = "this.selectedItemsString" [placeholder] = "this.label">
          <i class="pi pi-angle-down"></i>
      </div>

      <div class="expansion" #expansion *ngIf = "this.expanded"  (keydown) = "this.handleKeyPress($event)" tabindex="0">
          <div class="expansion__top">
            <p-checkbox class="expansion__top-checkbox" [binary] = "true" [(ngModel)] = "this.groupChecked" 
             (onChange) = "this.onCheckedAllClicked()"></p-checkbox>
            <div class="p-input-icon-right expansion__top-input">
              <i class="pi pi-plus-circle" *ngIf = "this.editable" (click) = "this.addNewItemClick()"></i>
              <input type="text" #filterInput pInputText [(ngModel)] = "this.currentFilter"
               (input) = "this.onFilterChange()" (focus) = "this.focusInput()">
            </div>
          </div>

          <!-- <div class="expansion__list"> -->
            <cdk-virtual-scroll-viewport #cdkViewport class="expansion__viewport" itemSize="32"
             [ngStyle] = "{'height': this.displayItems.length * 32 + 8 + 'px'}">
              <shop-multi-select-item *cdkVirtualFor="let item of displayItems" #item [label] = "item.label"
               [isChecked] = "item.isChecked" [isHighlighted] = "this.isHighlighted(item.label)"
               (onClick) = "this.onItemClick(item)"></shop-multi-select-item>
            </cdk-virtual-scroll-viewport>
           
          <!-- </div> -->
      </div>  
    </div>
  `,
  styleUrls: ['./editable-multi-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: EditableMultiSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableMultiSelectComponent implements OnInit, ControlValueAccessor {

  @Input() sort: boolean = true;
  @Input() label: string = "Wybierz";
  @Input() labelOverflowSize: number = 3;
  @Input() invalid: boolean = false;
  @Input() editable: boolean = true;
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild("filterInput")
  private filterInput!: ElementRef<HTMLInputElement>;

  @ViewChild("expansion")
  private expansion!: ElementRef<HTMLDivElement>;

  @ViewChildren("item") items!: QueryList<MultiSelectItemComponent>;

  @ViewChild("cdkViewport")
  private cdkViewport?: CdkVirtualScrollViewport;

  private _initializeItems: string[] = [];
  private expandedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public selectedItemsString: string = "";
  public allItems: ItemOptions[] = [];
  public currentFilter: string = "";
  public groupChecked: boolean = false;
  public onChangeFunction: any = () => { };
  public onTouchedFunction: any = () => { };
  private highlightedItem?: ItemOptions;

  @Input()
  set initializeItems(items: string[]) {
    this._initializeItems = items.map(item => item.toUpperCase());
    this.mergeWithInitializeItems();
    this.refreshDisplayInfo();
  }

  get initializeItems(): string[] {
    return this._initializeItems;
  }

  set expanded(value: boolean) {
    this.expandedSubject.next(value);
  }
  get expanded(): boolean {
    return this.expandedSubject.value;
  }

  @HostListener("document:click", ["$event"])
  public hideOnClickOutside(event: MouseEvent) {
    if (!this.eref.nativeElement.contains(event.target as Node) && this.expanded) {
      event.stopPropagation();
      this.expanded = false;
      this.checkForTouched();
    }
  }

  constructor(private eref: ElementRef<HTMLElement>, private cd: ChangeDetectorRef) { }

  public mergeWithInitializeItems() {
    let temp: ItemOptions[] = this.allItems.filter(item => item.isAdded); //addedItems
    let mappedInitializeItems: ItemOptions[] = this.initializeItems.map(item => {
      return {
        label: item,
        isDisplay: this.matchFilter(item), isAdded: false, isChecked: false
      };
    });
    temp = Array.prototype.concat(mappedInitializeItems, temp); //added + initialized with repeatitions
    let uniqueLabels: ItemOptions[] = [];
    temp.forEach(item => { //removing repeatition
      if (uniqueLabels.some(item2 => item2.label === item.label))
        return;
      uniqueLabels.push(item);
    }
    )
    this.allItems = uniqueLabels;
  }

  get displayItems(): ItemOptions[] {
    return this.allItems.filter(item => item.isDisplay);
  }

  writeValue(obj: string[]): void {
    if(!obj) return;
    obj = obj.map(item => item.toUpperCase());
    this.allItems.forEach(item => {
      item.isChecked = obj.includes(item.label);
    });
    this.onChange(false);
    this.cd.markForCheck();
  }
  
  registerOnChange(fn: any): void {
    this.onChangeFunction = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFunction = fn;
  }

  ngOnInit(): void {
    this.expandedSubject.subscribe(this.onExpandedChange.bind(this));
  }

  public switchExpanded(): void {
    this.expanded = !this.expanded;
    this.checkForTouched();
  }

  public checkForTouched() {
    if (!this.expanded) {
      this.onTouchedFunction();
      this.blur.emit();
    }
  }

  public focusInput(): void {
    setTimeout(() => {
      this.filterInput.nativeElement.focus();
      this.highlightedItem = undefined;
    }, 0);
  }

  public unfocusInput(): void {
    setTimeout(() => {
      this.filterInput.nativeElement.blur();
    }, 0);
  }

  public onExpandedChange(currentValue: boolean) {
    if (currentValue)
      this.focusInput();
  }

  public onItemClick(item: ItemOptions) {
    item.isChecked = !item.isChecked;
    this.groupChecked = this.isAllChecked();
    this.highlightedItem = item;
    this.onChange();
  }


  public onFilterChange() {
    this.currentFilter = this.currentFilter.toUpperCase();
    this.refreshDisplayInfo();
  }

  public refreshDisplayInfo() {
    this.allItems.map(item => { item.isDisplay = this.matchFilter(item.label); return item; });
    this.groupChecked = this.displayItems.length > 0 && this.displayItems.every(item => item.isChecked);
  }

  public addNewItemClick() {
    if (this.currentFilter.length === 0 || !this.editable) return;
    if (this.allItems.some(item => {
      if (item.label === this.currentFilter.toUpperCase()) {
        item.isChecked = true;
        return true;
      }
      return false;
    }))
      return;

    this.allItems.push({ label: this.currentFilter.toUpperCase(), isDisplay: true, isAdded: true, isChecked: true });
    this.currentFilter = "";

    if (this.sort) {
      this.allItems.sort((item1, item2) => {
        return item1.label.localeCompare(item2.label);
      });
    }
    this.refreshDisplayInfo();
    this.onChange();
  }

  public onCheckedAllClicked() {
    this.displayItems.forEach(item => item.isChecked = this.groupChecked);
    this.onChange();
  }


  private isAllChecked(): boolean {
    return !this.allItems.some(item => !item.isChecked);
  }

  private getCheckedStrings(): string[] {
    return this.allItems.filter(item => item.isChecked).map(item => item.label);
  }

  private onChange(triggerEvent: boolean = true) {
    let checkedStrings = this.getCheckedStrings();
    if (checkedStrings.length === 0) this.selectedItemsString = "";
    else this.selectedItemsString = `${checkedStrings.length} zaznaczeń`;
    if(triggerEvent) this.onChangeFunction(checkedStrings);
  }

  private matchFilter(value: string): boolean {
    return value.search(new RegExp(this.currentFilter)) != -1;
  }



  public handleKeyPress(event: KeyboardEvent) {
    const keyCode = event.code;
    if (!["Enter", "ArrowUp", "ArrowDown"].includes(keyCode)) return;
    this.expansion.nativeElement.focus();
    event.preventDefault();
    
    switch (keyCode) {
      case "Enter": {
        if (!this.highlightedItem) {
          this.addNewItemClick();
        }
        const filtered = this.displayItems.filter(item => item.label === this.highlightedItem?.label);
        if (filtered.length === 0) return;
        filtered[0].isChecked = !filtered[0].isChecked;
        this.onChange(true);
        break;
      }

      case "ArrowUp":
        {
          const filtered = this.displayItems.filter(item => item.label === this.highlightedItem?.label);
          if (filtered.length === 0)
            return;
          const index = this.displayItems.indexOf(filtered[0]);
          if (index === 0) {
            this.focusInput();
            break;
          };
          if (index <= 0) return;
          this.highlightedItem = this.displayItems[index - 1];
          break;
        }

      case "ArrowDown": {
        if (!this.highlightedItem && this.displayItems.length > 0) {
          this.highlightedItem = this.displayItems[0];
          this.unfocusInput();
          break;
        }
        const filtered = this.displayItems.filter(item => item.label === this.highlightedItem?.label);
        if (filtered.length === 0) return;
        const index = this.displayItems.indexOf(filtered[0]);
        if (index >= this.displayItems.length - 1) return;
        this.highlightedItem = this.displayItems[index + 1];
        break;
      }
      default: {
        return;
      }
    }
    if(!this.highlightedItem) return;
    this.scrollToItemIfOverflowing(this.highlightedItem);
  }

  public isHighlighted(itemValue: string): boolean {
    return itemValue === this.highlightedItem?.label;
  }

  public scrollToItemIfOverflowing(item: ItemOptions) {
    if(!this.cdkViewport) return;

    if(this.isItemOverflowing(this.items.find(i => i.label === item.label)!.eref.nativeElement)){
      this.cdkViewport?.scrollToIndex(this.displayItems.indexOf(item), "smooth");
    }
  }


  public isItemOverflowing(elementRef: HTMLElement){
    if(!this.cdkViewport) return true;
    const parent = this.cdkViewport.elementRef.nativeElement.getBoundingClientRect();
    const element = elementRef.getBoundingClientRect();
    console.log("parent: ", parent, "element: ", element);
    return parent.y > element.y || parent.y + parent.height < element.y + element.height;
  }
}
