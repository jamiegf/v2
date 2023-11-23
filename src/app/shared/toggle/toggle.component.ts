import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';


@Component({
  selector: 'mipools-front-end-toggle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent implements OnInit, OnDestroy {
  @Input() initialToggleState = false;
  @Output() toggleEvent = new EventEmitter<boolean>();
  private destroy$ = new Subject<void>();
  public toggleControl: FormControl<boolean> = new FormControl<boolean>(false, {
    nonNullable: true,
  });
  constructor(
    public activePoolService: ActivePoolService,
  ) {}

  ngOnInit(): void {
    this.toggleControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((toggle) => this.toggleEvent.emit(toggle));
    this.toggleControl.setValue(this.initialToggleState);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}