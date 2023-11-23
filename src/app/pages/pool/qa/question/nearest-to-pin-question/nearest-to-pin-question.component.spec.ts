import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearestToPinQuestionComponent } from './nearest-to-pin-question.component';

describe('NearestToPinQuestionComponent', () => {
  let component: NearestToPinQuestionComponent;
  let fixture: ComponentFixture<NearestToPinQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NearestToPinQuestionComponent]
    });
    fixture = TestBed.createComponent(NearestToPinQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
