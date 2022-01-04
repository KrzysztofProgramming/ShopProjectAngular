import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesSelectComponent } from './types-select.component';

describe('TypesSelectComponent', () => {
  let component: TypesSelectComponent;
  let fixture: ComponentFixture<TypesSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
