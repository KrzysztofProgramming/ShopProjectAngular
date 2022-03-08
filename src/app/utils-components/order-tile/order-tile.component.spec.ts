import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTileComponent } from './order-tile.component';

describe('OrderTileComponent', () => {
  let component: OrderTileComponent;
  let fixture: ComponentFixture<OrderTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
