import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleButtonDialogComponent } from './single-button-dialog.component';

describe('SingleButtonDialogComponent', () => {
  let component: SingleButtonDialogComponent;
  let fixture: ComponentFixture<SingleButtonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleButtonDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
