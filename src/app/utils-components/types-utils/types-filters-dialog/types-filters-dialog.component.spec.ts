import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesFiltersDialogComponent } from './types-filters-dialog.component';

describe('TypesFiltersDialogComponent', () => {
  let component: TypesFiltersDialogComponent;
  let fixture: ComponentFixture<TypesFiltersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesFiltersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesFiltersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
