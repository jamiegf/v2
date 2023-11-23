import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  template: '',
})
export abstract class ExitableComponent {
  @Output() exitEvent = new EventEmitter<void>();

  public exit() {
    this.exitEvent.emit();
  }
}
