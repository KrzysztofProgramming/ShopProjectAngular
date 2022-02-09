import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesSelectComponent } from './roles-select.component';

describe('RolesSelectComponent', () => {
  let component: RolesSelectComponent;
  let fixture: ComponentFixture<RolesSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
