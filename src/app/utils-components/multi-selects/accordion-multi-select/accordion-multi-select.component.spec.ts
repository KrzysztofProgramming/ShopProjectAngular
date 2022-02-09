import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionMultiSelectComponent } from './accordion-multi-select.component';

describe('AccordionListComponent', () => {
  let component: AccordionMultiSelectComponent;
  let fixture: ComponentFixture<AccordionMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccordionMultiSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
