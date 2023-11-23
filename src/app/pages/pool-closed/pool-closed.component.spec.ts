import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolClosedComponent } from './pool-closed.component';

describe('PoolClosedComponent', () => {
  let component: PoolClosedComponent;
  let fixture: ComponentFixture<PoolClosedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoolClosedComponent]
    });
    fixture = TestBed.createComponent(PoolClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
