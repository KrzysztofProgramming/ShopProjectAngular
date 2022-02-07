import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WildcartComponent } from './wildcart.component';

describe('WildcartComponent', () => {
  let component: WildcartComponent;
  let fixture: ComponentFixture<WildcartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WildcartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WildcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
