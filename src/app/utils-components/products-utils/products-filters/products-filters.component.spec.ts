import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFiltersComponent } from './products-filters.component';

describe('ProductsFiltersComponent', () => {
  let component: ProductsFiltersComponent;
  let fixture: ComponentFixture<ProductsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
