import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatorRedirectService } from 'src/app/core/services/system/authenticator-redirect.service';

@Component({
  selector: 'mipools-front-end-successful',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './successful.component.html',
  styleUrl: './successful.component.scss',
})
export class SuccessfulComponent {
  authenticatorRedirectService = inject(AuthenticatorRedirectService);
}
