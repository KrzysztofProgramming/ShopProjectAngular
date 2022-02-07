import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermsSelectComponent } from './perms-select.component';

describe('PermsSelectComponent', () => {
  let component: PermsSelectComponent;
  let fixture: ComponentFixture<PermsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermsSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
