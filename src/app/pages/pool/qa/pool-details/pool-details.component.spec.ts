import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolDetailsComponent } from './pool-details.component';

describe('PoolDetailsComponent', () => {
  let component: PoolDetailsComponent;
  let fixture: ComponentFixture<PoolDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoolDetailsComponent]
    });
    fixture = TestBed.createComponent(PoolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
