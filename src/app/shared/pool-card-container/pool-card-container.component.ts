import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PoolInfo } from 'src/app/core/models/pool/pool-info/pool-info.class';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { PoolCardComponent } from 'src/app/shared/pool-card/pool-card.component';

@Component({
  selector: 'mipools-front-end-pool-card-container[pools][poolPathFragment]',
  standalone: true,
  imports: [CommonModule, RouterLink, PoolCardComponent, LoadingComponent],
  template: `
    <div class="pool-card-container">
      @for (pool of pools; track pool.gameId) {
        <a routerLink="/pool/{{ pool.gameId }}/{{ poolPathFragment }}">
          <mipools-front-end-pool-card
            [pool]="pool"
          ></mipools-front-end-pool-card>
        </a>
      }
    </div>
  `,
  styles: `
  .pool-card-container {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 100%));
    column-gap: 0.5rem;
    row-gap: 0.5rem;
    justify-content: space-between;
    align-items: center;
    position: relative;
  
    .card {
      width: 100%;
    }
  
    @media screen and (min-width: 320px) {
      grid-template-columns: repeat(auto-fill, minmax(10.5rem, 48%));
    }
  
    @media screen and (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(14.5rem, 32.5%));
    }
  
    @media screen and (min-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(15rem, 24.4%));
    }
  }
  `,
})
export class PoolCardContainerComponent {
  @Input() pools!: PoolInfo[];
  /**
   * The ending fragement to determine what pool functionality to navigate to, e.g. 'qa' || 'edit'
   */
  @Input() poolPathFragment!: string;
}