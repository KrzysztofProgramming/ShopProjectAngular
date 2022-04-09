import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsFiltersComponent } from './authors-filters.component';

describe('AuthorsFiltersComponent', () => {
  let component: AuthorsFiltersComponent;
  let fixture: ComponentFixture<AuthorsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
