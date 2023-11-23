import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolRulesComponent } from './pool-rules.component';

describe('PoolRulesComponent', () => {
  let component: PoolRulesComponent;
  let fixture: ComponentFixture<PoolRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolRulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoolRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
