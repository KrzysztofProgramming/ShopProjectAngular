import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorCreatorComponent } from './author-creator.component';

describe('AuthorCreatorComponent', () => {
  let component: AuthorCreatorComponent;
  let fixture: ComponentFixture<AuthorCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
