import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomStepIconComponent } from './custom-step-icon.component';

describe('CustomStepIconComponent', () => {
  let component: CustomStepIconComponent;
  let fixture: ComponentFixture<CustomStepIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomStepIconComponent]
    });
    fixture = TestBed.createComponent(CustomStepIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
