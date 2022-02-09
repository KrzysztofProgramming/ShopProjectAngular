import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractMultiSelectComponent } from './abstract-multi-select.component';

describe('AbstractMultiSelectComponent', () => {
  let component: AbstractMultiSelectComponent;
  let fixture: ComponentFixture<AbstractMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractMultiSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
