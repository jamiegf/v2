import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { CategoryService } from 'src/app/core/services/pool/category.service';
import { AuthenticatorRedirectService } from 'src/app/core/services/system/authenticator-redirect.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';

@Component({
  selector: 'mipools-front-end-nav-menu [sideNavRef]',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  @Input() sideNavRef!: MatSidenav;
  public categoryService = inject(CategoryService);
  public userDetailsService = inject(UserDetailsService);
  public authenticatorRedirectService = inject(AuthenticatorRedirectService);
}
