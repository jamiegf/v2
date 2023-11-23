import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CustomQuestionIcon } from 'src/app/core/models/pool/pool-details/question/custom-question-icon.type';

@Component({
  selector: 'mipools-front-end-custom-step-icon[icon]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-step-icon.component.html',
  styleUrls: ['./custom-step-icon.component.scss'],
})
export class CustomStepIconComponent {
  @Input() icon!: CustomQuestionIcon;
}
