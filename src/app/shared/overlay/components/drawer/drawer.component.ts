import { Component } from '@angular/core';
import { DrawerService } from 'src/app/shared/overlay/services/drawer.service';

@Component({
  selector: 'mipools-front-end-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent {
  constructor(public drawerService: DrawerService) {}
}
