// src/app/services/url-service.ts

import { inject, InjectionToken, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { CreateShortUrlRequest, ShortUrl } from '@g2mu/core/data';
import { API_URL } from '@g2mu/core/config';

/**
 * Shape of our URL service API
 */
export interface UrlService {
  /** Signal holding the latest list of URLs */
  readonly urls: Signal<ShortUrl[]>;
  /** Fetch all URLs for current user */
  listUrls(): Observable<ShortUrl[]>;
  /** Fetch single URL by key */
  getUrl(key: string): Observable<ShortUrl>;
  /** Create or update a URL */
  saveUrl(url: CreateShortUrlRequest): Observable<ShortUrl>;
  /** Delete a URL */
  deleteUrl(key: string): Observable<void>;
  /** Check if a key is available */
  checkAvailability(key: string): Observable<boolean>;
}

/** Injection token for the URL service */
export const URL_SERVICE = new InjectionToken<UrlService>('URL_SERVICE');


/**
 * Default implementation of UrlService, using HttpClient + Signals
 */
export class RemoteUrlService implements UrlService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private _urls = signal<ShortUrl[]>([]);
  readonly urls = this._urls.asReadonly();

  listUrls(): Observable<ShortUrl[]> {
    return this.http.get<ShortUrl[]>(`${this.apiUrl}/urls/list`).pipe(
      tap(urls => this._urls.set(urls))
    );
  }

  getUrl(key: string): Observable<ShortUrl> {
    return this.http.get<ShortUrl>(`${this.apiUrl}/urls/${key}`);
  }

  saveUrl(url: CreateShortUrlRequest): Observable<ShortUrl> {
    return this.http.put<ShortUrl>(`${this.apiUrl}/urls/${url.key}`, url).pipe(
      tap(saved => {
        const list = this._urls();
        const idx = list.findIndex(u => u.key === saved.key);
        if (idx > -1) {
          // update existing
          this._urls.set([...list.slice(0, idx), saved, ...list.slice(idx + 1)]);
        } else {
          // add new
          this._urls.set([...list, saved]);
        }
      })
    );
  }

  deleteUrl(key: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/urls/${key}`).pipe(
      tap(() => {
        this._urls.set(this._urls().filter(u => u.key !== key));
      })
    );
  }

  checkAvailability(key: string): Observable<boolean> {
    return this.http
      .post<{ available: boolean }>(`${this.apiUrl}/urls/is-available`, { key })
      .pipe(map(res => res.available));
  }
}

export const provideUrlService = {
    provide: URL_SERVICE,
    useClass: RemoteUrlService,
};