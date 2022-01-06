import { SortOption, SORT_OPTIONS } from './../../models/models';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shop-filters-dialog',
  templateUrl: 'filters-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./filters-dialog.component.scss']
})
export class FiltersDialogComponent implements OnInit {
  @Input() visibility: boolean = false;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  public items = SORT_OPTIONS;
  public selectedSortOption: SortOption = {name: "Sortowanie: Trafność", code: "none"};

  _selectedPageCount: number = 10;
  sortOptions: SortOption[] = SORT_OPTIONS;
  sortOptionModel: SortOption = {name: "Sortowanie: Trafność", code: "none"};
    

  set selectedPageCount(value: number){
    this._selectedPageCount = value;
  }
  get selectedPageCount(): number{
    return this._selectedPageCount;
  }

  constructor() {}

  ngOnInit(): void {
  }

}
