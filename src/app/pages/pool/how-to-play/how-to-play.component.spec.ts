import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToPlayComponent } from './splash.component';

describe('PoolSplashComponent', () => {
  let component: HowToPlayComponent;
  let fixture: ComponentFixture<HowToPlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HowToPlayComponent],
    });
    fixture = TestBed.createComponent(HowToPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
