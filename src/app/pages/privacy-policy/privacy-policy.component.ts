import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mipools-front-end-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {


  openChat() {
    alert('please link to intercom');
  }
}
