import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  public replaceState(url: URL): void {
    history.replaceState(null, '', url);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ServerHistoryService extends HistoryService {
  public override replaceState(_url: URL): void {
    return;
  }
}
