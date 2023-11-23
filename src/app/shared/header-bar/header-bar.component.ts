import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { HeaderBarService } from 'src/app/shared/header-bar/header-bar.service';
import { UserChipComponent } from 'src/app/shared/header-bar/user-chip/user-chip.component';

@Component({
  selector: 'mipools-front-end-header-bar',
  standalone: true,
  imports: [CommonModule, UserChipComponent, RouterModule],
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent {
  @Input() sideNavRef!: MatSidenav;
  constructor(public headerBarService: HeaderBarService) {}
}
