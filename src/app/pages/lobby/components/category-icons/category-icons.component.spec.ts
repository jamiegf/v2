import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryIconsComponent } from './category-icons.component';

describe('CategoryIconsComponent', () => {
  let component: CategoryIconsComponent;
  let fixture: ComponentFixture<CategoryIconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CategoryIconsComponent]
    });
    fixture = TestBed.createComponent(CategoryIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
