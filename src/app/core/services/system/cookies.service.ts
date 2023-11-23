import { Inject, Injectable, Optional } from '@angular/core';
import { REQUEST, RESPONSE } from '../../../../express.tokens';
import { Request, Response } from 'express';
@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  private cookies: Record<string, string> = {};
  private document: Document | { cookie: string } = { cookie: '' };

  constructor(
    @Optional() @Inject(REQUEST) private req: Request<unknown>,
    @Optional() @Inject(RESPONSE) private res: Response<unknown>,
  ) {
    if (this.req !== null || this.res !== null) {
      this.cookies = {
        ...res.locals['cookies'],
        ...req.cookies,
      };
    } else {
      this.document = document;
      this.document.cookie
        .split(';')
        .map((v) => v.split('='))
        .forEach((cookie) => {
          if (cookie.length === 2) {
            this.cookies[cookie[0].trim()] = cookie[1].trim();
          }
        });
    }
  }

  public getItem(key: CookieKey): string | null {
    return this.cookies[key] || null;
  }

  public setItem(cookie: Cookie): boolean {
    this.removeItem(cookie.key);
    this.cookies[cookie.key] = cookie.value;

    if (!cookie.path) {
      cookie.path = '/';
    }

    let expiryString = '';
    if (cookie.expires) {
      expiryString = `; expires=${cookie.expires.toISOString()}`;
    }

    this.document.cookie = `${cookie.key}=${cookie.value}${expiryString}; path=${cookie.path}`;
    this.cookies[cookie.key] = cookie.value;

    if (this.res !== null) {
      this.res.cookie(cookie.key, cookie.value, {
        path: cookie.path,
        expires: cookie.expires,
      });
    }

    return true;
  }

  public removeItem(key: CookieKey, path?: string): boolean {
    if (!this.cookies[key]) return false;
    if (!path) {
      path = '/';
    }
    this.document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    delete this.cookies[key];
    if (this.res) {
      this.res.cookie(key, null, {
        path: path,
        expires: new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
      });
    }
    return true;
  }
}

export type CookieKey = 'jwt';

export interface Cookie {
  key: CookieKey;
  value: string;
  expires?: Date;
  path?: string;
}
