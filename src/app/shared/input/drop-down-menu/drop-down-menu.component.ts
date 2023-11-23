import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, scan } from 'rxjs';

@Component({
  selector: 'mipools-front-end-drop-down-menu[options]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drop-down-menu.component.html',
  styleUrls: ['./drop-down-menu.component.scss'],
})
export class DropDownMenuComponent {
  @Input() options!: string[];
  @Output() selectedIndexEmitter = new EventEmitter<number>();
  private toggle$ = new Subject<void>();
  public display$ = this.toggle$.pipe(scan((state) => (state = !state), false));
  public toggle(): void {
    this.toggle$.next();
  }
}