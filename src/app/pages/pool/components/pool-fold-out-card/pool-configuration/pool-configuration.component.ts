import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConvertGeAmountToTextPipe } from 'src/app/core/pipes/convert-ge-amount-to-text.pipe';
import { ConfigurationDetails } from 'src/app/pages/pool/entry.service';
import { ActivePoolService } from 'src/app/pages/pool/active-pool.service';

@Component({
  selector: 'mipools-front-end-pool-configuration[configuration][selected]',
  standalone: true,
  imports: [CommonModule, ConvertGeAmountToTextPipe],
  templateUrl: './pool-configuration.component.html',
  styleUrls: ['./pool-configuration.component.scss'],
})
export class PoolConfigurationComponent {
  @Input() configuration!: ConfigurationDetails;
  @Input() selected!: boolean;
  constructor(
    public activePoolService: ActivePoolService,
  ) {}
}
