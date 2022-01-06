import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableMultiSelectComponent } from './dropdown-multi-select.component';

describe('EditableMultiSelectComponent', () => {
  let component: EditableMultiSelectComponent;
  let fixture: ComponentFixture<EditableMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditableMultiSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
