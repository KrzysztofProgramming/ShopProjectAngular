import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypesCreatorComponent } from './types-creator.component';

describe('TypesCreatorComponent', () => {
  let component: TypesCreatorComponent;
  let fixture: ComponentFixture<TypesCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypesCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypesCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
