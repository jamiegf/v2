import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mipools-front-end-responsible-gaming',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './responsible-gaming.component.html',
  styleUrls: ['./responsible-gaming.component.scss']
})
export class ResponsibleGamingComponent {

  openChat() {
    alert('Need to link button to Intercom chat');
  }

  showIntercom() {
    alert('Need to link button to Intercom chat');
  }
}
