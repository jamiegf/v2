import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolDropDownMenuComponent } from './pool-drop-down-menu.component';

describe('PoolQaMenuComponent', () => {
  let component: PoolDropDownMenuComponent;
  let fixture: ComponentFixture<PoolDropDownMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PoolDropDownMenuComponent],
    });
    fixture = TestBed.createComponent(PoolDropDownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
