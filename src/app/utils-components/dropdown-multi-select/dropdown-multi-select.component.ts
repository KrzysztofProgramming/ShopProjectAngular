import { AbstractListItemComponent } from '../abstract-multi-select/abstract-multi-select.component';
import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, HostListener, ChangeDetectorRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AbstractMultiSelectComponent, ItemOptions } from '../abstract-multi-select/abstract-multi-select.component';

@Component({
  selector: 'shop-dropdown-multi-select-item',
  template: `
    <div class="content" [class.selected] = "this.isChecked" [class.highlighted] = "this.isHighlighted">
        <p-checkbox #checkbox [readonly] = "true" [ngModel] = "this.isChecked" class="checkbox" [binary] = "true"></p-checkbox>
        <div class="label"> {{this.getLabel()}} </div>
    </div>
  `,
  styles: [
    `
    @import "../../../styling/all.scss";

    :host{
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 33px;
    }

    .content{
      height: 30px;
      padding: 0 4px 0 4px;
      margin: 1.5px 2px 1.5px 2px;
      display: flex;
      flex-direction: row;
      align-items: center;
      transition-duration: 150ms;
      border-radius: 3px;
      cursor: pointer;
      transition-duration: 150ms;

      &:hover{
        background-color: $theme-border;
        z-index: 2;
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
        z-index: 2;
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
export class MultiSelectItemComponent extends AbstractListItemComponent{
  constructor(eref: ElementRef<HTMLElement>) {
    super(eref);
  }
}


@Component({
  selector: 'shop-dropdown-multi-select',
  template: `
    <div class="content" #container>
      <div class="top" (click) = "this.switchExpanded()" [class.top--invalid] = "this.invalid">
          <input class="top__input-label" readonly='true' [value] = "this.selectedItemsString" [placeholder] = "this.label">
          <i class="pi pi-angle-down"></i>
      </div>

      <div class="expansion" #expansion *ngIf = "this.expanded"  (keydown) = "this.handleKeyPress($event)" tabindex="0">
        <ng-container *ngIf="!this.waitingForDataFlag">
            <div class="expansion__top">
              <p-checkbox class="expansion__top-checkbox" [binary] = "true" [(ngModel)] = "this.groupChecked" 
               (onChange) = "this.onGroupCheckClicked()"></p-checkbox>
              <div class="p-input-icon-right expansion__top-input">
                <input type="text" #filterInput pInputText [(ngModel)] = "this.currentFilter"
                 (input) = "this.onFilterChange()" (focus) = "this.focusInput()">
              </div>
            </div>
  
            <!-- <div class="expansion__list"> -->
              <cdk-virtual-scroll-viewport #cdkViewport class="expansion__viewport" itemSize="32"
               [ngStyle] = "{'height': this.displayItems.length * 33 + 8 + 'px'}"
               >
                <shop-dropdown-multi-select-item *cdkVirtualFor="let item of displayItems" #item [element] = "item.element"
                [displayProperty] = "this.displayProperty"
                 [isChecked] = "item.isChecked" [isHighlighted] = "this.isHighlighted(item)"
                 (click) = "this.onItemClick(item)"></shop-dropdown-multi-select-item>
              </cdk-virtual-scroll-viewport>
         </ng-container>     
         <div class="expansion__busy-overlay" *ngIf="this.waitingForDataFlag">
           <shop-busy-overlay overlayStyle = "light"></shop-busy-overlay>
         </div>      
          <!-- </div> -->
      </div>  
    </div>
  `,
  styleUrls: ['./dropdown-multi-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: EditableMultiSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableMultiSelectComponent extends AbstractMultiSelectComponent implements OnInit, ControlValueAccessor, OnDestroy {

  @ViewChild("filterInput")
  private filterInput!: ElementRef<HTMLInputElement>;

  @ViewChild("expansion")
  private expansion!: ElementRef<HTMLDivElement>;

  @ViewChildren("item") generatedItems!: QueryList<MultiSelectItemComponent>;

  @ViewChild("cdkViewport")
  private cdkViewport?: CdkVirtualScrollViewport;

  @HostListener("document:click", ["$event"])
  public hideOnClickOutside(event: MouseEvent) {
    if (!this.eref.nativeElement.contains(event.target as Node) &&
     (this.expansion ? !this.expansion.nativeElement.contains(event.target as Node) : true) && this.expanded) {
      event.preventDefault();
      event.stopPropagation();
      this.expanded = false;
      this.checkForTouched();
    }
  }


  constructor(eref: ElementRef<HTMLElement>, cd: ChangeDetectorRef) {
    super(eref, cd)
   }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public focusInput(): void {
    setTimeout(() => {
      if(!this.filterInput) return;
      this.filterInput.nativeElement.focus();
      this.highlightedItem = undefined;
    }, 0);
  }

  public unfocusInput(): void {
    setTimeout(() => {
      if(!this.filterInput) return;
      this.filterInput.nativeElement.blur();
    }, 0);
  }

  public scrollToItemIfOverflowing(item: ItemOptions) {
    if(!this.cdkViewport) return;
    let scrollOffset = 7;
    if(!this.previouslyHighlightedItem) scrollOffset = 0;
    else if(this.previouslyHighlightedItem.displayItemsIndex! - item.displayItemsIndex! < 0) scrollOffset = 1;
    

    if(this.isItemOverflowing(this.generatedItems.find(a => a.element === item.element)?.eref.nativeElement)){
      this.cdkViewport?.scrollToIndex(Math.max(item.displayItemsIndex! - scrollOffset, 0), "smooth");
    }
  }

  public focusExpansion(){
    this.expansion.nativeElement.focus();
  }

  public isItemOverflowing(elementRef: HTMLElement | undefined){
    if(!this.cdkViewport) return true;
    if(!elementRef) return true;
    const parent = this.cdkViewport.elementRef.nativeElement.getBoundingClientRect();
    const element = elementRef.getBoundingClientRect();
    return parent.y > element.y || parent.y + parent.height < element.y + element.height;
  }
}
