import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegistrationStepperComponent } from 'src/app/pages/registration/registration-stepper/registration-stepper.component';
import { RegistrationService } from 'src/app/pages/registration/registration.service';

@Component({
  selector: 'mipools-front-end-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, RegistrationStepperComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  public registrationService = inject(RegistrationService);
}
