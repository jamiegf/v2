import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolMenuComponent } from './pool-menu.component';

describe('PoolMenuComponent', () => {
  let component: PoolMenuComponent;
  let fixture: ComponentFixture<PoolMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoolMenuComponent]
    });
    fixture = TestBed.createComponent(PoolMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
