import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mipools-front-end-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  openChat() {
    alert('Need to link button to Intercom chat');
  }
}
