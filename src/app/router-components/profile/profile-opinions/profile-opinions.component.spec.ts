import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileOpinionsComponent } from './profile-opinions.component';

describe('ProfileOpinionsComponent', () => {
  let component: ProfileOpinionsComponent;
  let fixture: ComponentFixture<ProfileOpinionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileOpinionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileOpinionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
