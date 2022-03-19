import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'shop-types-list',
  templateUrl: './types-list.component.html',
  styleUrls: ['./types-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypesListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
