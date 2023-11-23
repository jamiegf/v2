import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationStepperComponent } from './registration-stepper.component';

describe('RegistrationStepperComponent', () => {
  let component: RegistrationStepperComponent;
  let fixture: ComponentFixture<RegistrationStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrationStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
