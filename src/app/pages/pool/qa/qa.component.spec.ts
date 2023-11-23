import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QaComponent } from './qa.component';

describe('PoolQaComponent', () => {
  let component: QaComponent;
  let fixture: ComponentFixture<QaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QaComponent],
    });
    fixture = TestBed.createComponent(QaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
