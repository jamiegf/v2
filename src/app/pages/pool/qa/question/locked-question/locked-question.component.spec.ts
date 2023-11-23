import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedQuestionComponent } from './locked-question.component';

describe('LockedQuestionComponent', () => {
  let component: LockedQuestionComponent;
  let fixture: ComponentFixture<LockedQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LockedQuestionComponent]
    });
    fixture = TestBed.createComponent(LockedQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
