import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolControlsComponent } from './pool-controls.component';

describe('PoolControlsComponent', () => {
  let component: PoolControlsComponent;
  let fixture: ComponentFixture<PoolControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoolControlsComponent]
    });
    fixture = TestBed.createComponent(PoolControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
