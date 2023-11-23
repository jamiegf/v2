/* eslint-disable @typescript-eslint/no-unused-vars */
import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';

/**
 * Client side guard for window globals
 */
@Injectable({
  providedIn: 'root',
})
export class WindowService {
  public get href(): string {
    return window.location.href;
  }

  public set href(href: string) {
    window.location.href = href;
  }

  public get url(): URL {
    return new URL(this.href);
  }

  public get origin(): string {
    return window.location.origin;
  }

  public get innerWidth(): number {
    return window.innerWidth;
  }

  public openInNewTab(url: string): void {
    window.open(url, '_blank');
  }
}

/**
 * Server side guard for window globals
 */
@Injectable()
export class ServerWindowService extends WindowService {
  constructor(@Optional() @Inject(APP_BASE_HREF) private baseHref: string) {
    super();
  }

  override get href(): string {
    return this.baseHref;
  }

  override set href(href: string) {
    return;
  }

  override get origin(): string {
    return new URL(this.baseHref).origin;
  }

  public override get innerWidth(): number {
    return 0;
  }

  override openInNewTab(url: string): void {
    return;
  }
}
