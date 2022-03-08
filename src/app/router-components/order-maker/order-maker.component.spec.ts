import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMakerComponent } from './order-maker.component';

describe('OrderMakerComponent', () => {
  let component: OrderMakerComponent;
  let fixture: ComponentFixture<OrderMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderMakerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
