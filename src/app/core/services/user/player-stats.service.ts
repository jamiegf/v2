import { Injectable } from '@angular/core';
import { UserDataService } from 'src/app/core/models/user-data-service.class';
import { MiddlewareRequestService } from 'src/app/core/services/system/middleware-request.service';
import { UserDetailsService } from 'src/app/core/services/user/user-details.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlayerStatsService extends UserDataService<
  Partial<PlayerStatsResponse>,
  PlayerStats
> {
  constructor(
    middlewareRequestService: MiddlewareRequestService,
    userDetailsService: UserDetailsService,
  ) {
    super(
      {
        apiUrl: environment.api.middleware.playerStats,
        logTitle: 'playerStats',
      },
      middlewareRequestService,
      userDetailsService,
    );
  }

  public getStats() {
    this.refreshData();
    return this.data$;
  }

  protected override mapFunction(
    data: Partial<PlayerStatsResponse>,
  ): PlayerStats {
    return {
      moneyInPlay: this.convertPartialStringToFixedValue(data.tokens_in_play),
      potentialWinnings: this.convertPartialStringToFixedValue(
        data.potential_winnings,
      ),
    };
  }

  private convertPartialStringToFixedValue(value?: string): string | undefined {
    const float = parseFloat(value as string);
    if (!isNaN(float)) {
      return float.toFixed(2);
    }

    return undefined;
  }
}

interface PlayerStatsResponse {
  errors: unknown[];
  success: boolean;
  average_stake: number;
  num_entries: string;
  num_prizes: string;
  tokens_in_play: string;
  potential_winnings: string;
  multiplier: unknown;
  status: string;
  loyalty_points_this_month: unknown;
  num_prizes_per_game_type: {
    game_type: string;
    num_prizes: string;
  }[];
  halls_of_fame: unknown[];
  statuses: {
    name: string;
    multiplier: string;
    stat_info: string;
  }[];
  duration: number;
}

interface PlayerStats {
  moneyInPlay?: string;
  potentialWinnings?: string;
}
