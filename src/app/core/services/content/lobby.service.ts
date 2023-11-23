import { Injectable } from '@angular/core';
import { FetchPoolInfoService } from 'src/app/core/services/pool/pool-info.service';

@Injectable({
  providedIn: 'root',
})
export class LobbyService {
  public availableSports$ = this.poolInfoService.poolInfoByStatus$.pipe();

  constructor(private poolInfoService: FetchPoolInfoService) {}
}
