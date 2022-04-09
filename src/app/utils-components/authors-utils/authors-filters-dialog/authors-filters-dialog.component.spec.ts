import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsFiltersDialogComponent } from './authors-filters-dialog.component';

describe('AuthorsFiltersDialogComponent', () => {
  let component: AuthorsFiltersDialogComponent;
  let fixture: ComponentFixture<AuthorsFiltersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorsFiltersDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsFiltersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
