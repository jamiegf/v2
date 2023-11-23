import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolCardContainerComponent } from './pool-card-container.component';

describe('PoolCardContainerComponent', () => {
  let component: PoolCardContainerComponent;
  let fixture: ComponentFixture<PoolCardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolCardContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoolCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
