import { Component } from '@angular/core';
import { stopPropagation } from 'src/app/lib/prevent-click-propagation';
import { OverlayService } from 'src/app/shared/overlay/overlay.service';

@Component({
  selector: 'mipools-front-end-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent {
  constructor(public overlayService: OverlayService) {}

  public stopPropagation = stopPropagation;
}