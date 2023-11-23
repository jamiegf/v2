import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mipools-front-end-pool-rules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pool-rules.component.html',
  styleUrl: './pool-rules.component.scss'
})
export class PoolRulesComponent implements OnInit {
  
  currentStep: Steps | undefined;

  readonly Steps = Steps;

  ngOnInit(): void {
    this.currentStep = Steps.STEP_1;;
  }

  openChat() {
    alert('please link to intercom');
  }

}

enum Steps {
  STEP_1 = 'Pool Rules',
  STEP_2 = 'Predictor Rules',
  STEP_3 = 'Fantasy Rules',
  STEP_4 = 'Survivor Rules',
}