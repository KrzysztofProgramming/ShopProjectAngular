import { AbstractListComponent } from './../abstract-editable-list/abstract-list.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-accordion-list',
  template: `
    <div class="container">
    </div>
  `,
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: AccordionListComponent,
      multi: true
    }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./accordion-list.component.scss']
})
export class AccordionListComponent extends AbstractListComponent implements OnInit {
    
  constructor(eref: ElementRef<HTMLElement>, cd: ChangeDetectorRef) {
    super(eref, cd);
   }

  ngOnInit(): void {
  }

}
