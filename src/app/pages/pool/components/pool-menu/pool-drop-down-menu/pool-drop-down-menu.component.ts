import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'mipools-front-end-pool-drop-down-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pool-drop-down-menu.component.html',
  styleUrls: ['./pool-drop-down-menu.component.scss'],
})
export class PoolDropDownMenuComponent {
  openMenu = false;

  openMenuDropDown() {
    this.openMenu = !this.openMenu;
  }
}
