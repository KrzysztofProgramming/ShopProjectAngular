import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeProductsComponent } from './merge-products.component';

describe('MergeProductsComponent', () => {
  let component: MergeProductsComponent;
  let fixture: ComponentFixture<MergeProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
