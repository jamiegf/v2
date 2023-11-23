import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitButtonComponent } from './exit-button.component';

describe('ExitComponent', () => {
  let component: ExitButtonComponent;
  let fixture: ComponentFixture<ExitButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExitButtonComponent],
    });
    fixture = TestBed.createComponent(ExitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
