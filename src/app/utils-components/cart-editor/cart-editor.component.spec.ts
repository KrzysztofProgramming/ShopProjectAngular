import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartEditorComponent } from './cart-editor.component';

describe('CartEditorComponent', () => {
  let component: CartEditorComponent;
  let fixture: ComponentFixture<CartEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
