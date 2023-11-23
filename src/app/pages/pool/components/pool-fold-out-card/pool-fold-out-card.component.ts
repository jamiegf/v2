import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';
import { PoolConfigurationComponent } from 'src/app/pages/pool/components/pool-fold-out-card/pool-configuration/pool-configuration.component';
import { EntryService } from 'src/app/pages/pool/entry.service';
import { PoolCardComponent } from 'src/app/shared/pool-card/pool-card.component';

@Component({
  selector: 'mipools-front-end-pool-fold-out-card',
  standalone: true,
  imports: [CommonModule, PoolCardComponent, PoolConfigurationComponent],
  templateUrl: './pool-fold-out-card.component.html',
  styleUrls: ['./pool-fold-out-card.component.scss'],
})
export class PoolFoldOutCardComponent {
  constructor(
    public activePoolService: ActivePoolService,
    public entryService: EntryService,
  ) {}
}
