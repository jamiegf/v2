import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureQuestionComponent } from './fixture-question.component';

describe('FixtureQuestionComponent', () => {
  let component: FixtureQuestionComponent;
  let fixture: ComponentFixture<FixtureQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FixtureQuestionComponent]
    });
    fixture = TestBed.createComponent(FixtureQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
