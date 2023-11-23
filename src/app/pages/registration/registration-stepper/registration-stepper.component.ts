import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RegistrationService } from 'src/app/pages/registration/registration.service';

@Component({
  selector: 'mipools-front-end-registration-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration-stepper.component.html',
  styleUrl: './registration-stepper.component.scss',
})
export class RegistrationStepperComponent {
  public registrationService = inject(RegistrationService);
  steps = [0, 1, 2, 3];
}
