import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolFoldOutCardComponent } from './pool-fold-out-card.component';

describe('PoolFoldOutCardComponent', () => {
  let component: PoolFoldOutCardComponent;
  let fixture: ComponentFixture<PoolFoldOutCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoolFoldOutCardComponent]
    });
    fixture = TestBed.createComponent(PoolFoldOutCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
