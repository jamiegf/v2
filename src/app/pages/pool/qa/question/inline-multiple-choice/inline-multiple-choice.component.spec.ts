import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineMultipleChoiceComponent } from './inline-multiple-choice.component';

describe('InlineMultipleChoiceComponent', () => {
  let component: InlineMultipleChoiceComponent;
  let fixture: ComponentFixture<InlineMultipleChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineMultipleChoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InlineMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
