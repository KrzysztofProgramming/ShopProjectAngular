import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesFiltersComponent } from './types-filters.component';

describe('TypesFiltersComponent', () => {
  let component: TypesFiltersComponent;
  let fixture: ComponentFixture<TypesFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
