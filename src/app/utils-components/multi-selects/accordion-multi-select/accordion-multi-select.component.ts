import { AbstractMultiSelectComponent, ItemModel, ItemOptions } from '../abstract-multi-select/abstract-multi-select.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ChangeDetectorRef, OnDestroy, ViewChild, QueryList, ViewChildren, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MultiSelectItemComponent } from '../dropdown-multi-select/dropdown-multi-select.component';

@Component({
  selector: 'shop-accordion-multi-select',
  template: `
    <div class="container">
      <div class="title" [ngClass] = "{'title--expanded': this.expanded}" (click)="this.switchExpanded()">
        <div class="title__header">{{ this.selectedItemsString }}</div>
        <div class="title__icon" [@iconRotation] = "this.expanded ? 'expanded' : 'collapsed'"><i class="pi pi-angle-left"></i></div>
      </div>
      <div class="animation-wrapper" *ngIf="this.expanded" @smoothExpanding>
        <div class="expansion" #expansion (keydown)="this.handleKeyPress($event)" tabindex="0">
          <div class="expansion__searcher">
            <p-checkbox class="expansion__searcher-checkbox" [binary]="true" [(ngModel)]="this.groupChecked"
            (onChange)="this.onGroupCheckClicked()"></p-checkbox>
            <input class="expansion__searcher-input" shopInputText [(ngModel)] = "this.currentFilter"
             (input)="this.onFilterChange()" #filterInput>
          </div>
          <cdk-virtual-scroll-viewport [ngStyle] = "{'max-height': this.viewportMaxHeight + 'px'}"
            #cdkViewport class="expansion__viewport" itemSize="32">
          <shop-dropdown-multi-select-item
            *cdkVirtualFor="let item of displayItems" #item [element]="item.element"[displayProperty]="this.displayProperty"
            [isChecked]="item.isChecked"[isHighlighted]="this.isHighlighted(item)" (click)="this.onItemClick(item)">
          </shop-dropdown-multi-select-item>
          </cdk-virtual-scroll-viewport>
        </div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AccordionMultiSelectComponent,
      multi: true,
    },
  ],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./accordion-multi-select.component.scss'],
})
export class AccordionMultiSelectComponent
  extends AbstractMultiSelectComponent
  implements OnInit, OnDestroy {

  constructor(eref: ElementRef<HTMLElement>, cd: ChangeDetectorRef) {
    super(eref, cd);
    // this.expanded = true;
  }

  @ViewChild("filterInput")
  private filterInput!: ElementRef<HTMLInputElement>;

  @ViewChild("expansion")
  private expansion!: ElementRef<HTMLDivElement>;

  @ViewChild("cdkViewport")
  private cdkViewport?: CdkVirtualScrollViewport;

  @ViewChildren("item") generatedItems!: QueryList<MultiSelectItemComponent>;

  public viewportMaxHeight: number = 300;

  @Input()
  set items(obj: ItemModel[]) {
    super.items = obj;
    this.viewportMaxHeight = this.allItems.length * 32 + 8;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy(): void {
      super.ngOnDestroy();
  }

  public focusInput(): void {
    setTimeout(() => {
      if(!this.filterInput) return;
      this.filterInput.nativeElement.focus();
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
