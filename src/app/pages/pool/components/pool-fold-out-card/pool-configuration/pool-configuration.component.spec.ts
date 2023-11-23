import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolConfigurationComponent } from './pool-configuration.component';

describe('PoolConfigurationComponent', () => {
  let component: PoolConfigurationComponent;
  let fixture: ComponentFixture<PoolConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoolConfigurationComponent]
    });
    fixture = TestBed.createComponent(PoolConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
