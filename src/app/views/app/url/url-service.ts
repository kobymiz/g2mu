// src/app/services/url-service.ts

import { inject, InjectionToken, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { CreateShortUrlRequest, ShortUrl } from '@g2mu/core/data';
import { API_URL } from '@g2mu/core/config';

import axios, { Axios, AxiosError, AxiosInstance } from 'axios';

/**
 * Shape of our URL service API
 */
export interface UrlService {
  /** Signal holding the latest list of URLs */
  readonly urls: Signal<ShortUrl[]>;
  
  /** Signal holding the latest URL loaded */
  readonly latestUrl: Signal<ShortUrl | null>;

  /** Fetch all URLs for current user */
  listUrls(): Observable<ShortUrl[]>;
  /** Fetch single URL by key */
  getUrl(key: string): Observable<ShortUrl|null>;
  /** Create or update a URL */
  saveUrl(url: CreateShortUrlRequest): Observable<ShortUrl>;
  /** Delete a URL */
  deleteUrl(key: string): Observable<void>;
  /** Check if a key is available */
  checkAvailability(key: string): Observable<boolean>;
}

/** Injection token for the URL service */
export const URL_SERVICE = new InjectionToken<UrlService>('URL_SERVICE');

// export class TestGetUrl{
//   private client: AxiosInstance;
//   private apiUrl = inject(API_URL);

//   constructor() {
//     // You can configure baseURL, timeouts, etc. here
//     this.client = axios.create({
//       baseURL: this.apiUrl,
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
//   }

//   async getUrl(key: string): Promise<ShortUrl | null> {
//     try {
//       const resp = await this.client.get<ShortUrl>(`${this.apiUrl}/urls/${key}`, {
//         headers: { Authorization: `Bearer eyJraWQiOiJydkRxWW93b2xmT1VqbnYrUU8yS1JpXC9UTVdBUGkrUVArT0VFallwc0NDbz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJmNjUyNTI5NC1kMGExLTcwZGYtNTdiOS00YTI1OTQyMGI1YmQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTJfMkx2U1YxMnpVIiwiY29nbml0bzp1c2VybmFtZSI6ImY2NTI1Mjk0LWQwYTEtNzBkZi01N2I5LTRhMjU5NDIwYjViZCIsIm9yaWdpbl9qdGkiOiJkMGY3ZDBhMi0zYTI2LTQyNTctOTQ0MS05NDc0ODQyMjk5NzYiLCJhdWQiOiIyZGZoMXM2ZXBmOTdkN3RtY2Iwdmhua2ltNCIsImV2ZW50X2lkIjoiMjMxZTI2ZDMtM2M3Ni00MmZlLWI2NDctNmJmYTU2OTczOWRmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3NTE5ODkyNjQsIm5hbWUiOiJrb2J5bWl6QGdtYWlsLmNvbSIsImV4cCI6MTc1MjE4MjQ4MywiaWF0IjoxNzUyMTc4ODgzLCJqdGkiOiJkOGY5ZTU4MC1kOTYyLTQ2YjItOWI4MC0wNzZmNTY4YTJjNWUiLCJlbWFpbCI6ImtvYnltaXpAZ21haWwuY29tIn0.QzafoISgWo1-522mQBPcHeKrKJu2mrl0ggkS67NpS8uABcTfAA4hgklqlEMk2YVL615UD4Ds47FcQUKxy1B-lgl7G-J-vpHBszRKfP2501QRI83vcWgD6eGk0bOjL1IoHLpGNYQIukQSaQ2YBz1QB2phWI3Crc8AWxa31aGXyy1lBVMkkEXjAdO1ps8WEpNcBvoDnoqhW5B0LG5ijtTU9jLbMPRxTQUp6qJ31T6GnO364GSlxPZuhH8-gg40oev2gBd-rr1eTdF0fl_xbxDIFFo-ig3z1emevGH-QsLUfMQ-zWMXN9ABjLT2ssvyJNg19DxlhSTqvM2gVAJrtUSOXA` }
//       });
//       console.log('Response data:', resp.data);
//       return resp.data;
//     } catch (err) {
//       console.error('Error fetching URL:', JSON.stringify(err, null, 2));
//       console.log('Response headers: ', (err as AxiosError).response?.headers);
//       // Axios wraps errors in AxiosError
//       if (axios.isAxiosError(err)) {
//         const axiosErr = err as AxiosError;
        
//         if (axiosErr.response?.status === 404) {
//           return null;
//         }
//       }
//       // rethrow anything else
//       throw err;
//     }
//   }
// }


/**
 * Default implementation of UrlService, using HttpClient + Signals
 */
export class RemoteUrlService implements UrlService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private _urls = signal<ShortUrl[]>([]);
  readonly urls = this._urls.asReadonly();

  private _latestUrl = signal<ShortUrl | null>(null);  
  readonly latestUrl: Signal<ShortUrl | null> = this._latestUrl.asReadonly(); 
  

  listUrls(): Observable<ShortUrl[]> {
    return this.http.get<ShortUrl[]>(`${this.apiUrl}/urls/list`).pipe(
      tap(urls => this._urls.set(urls))
    );
  }

  getUrl(key: string): Observable<ShortUrl |null> {    
    return this.http.get<ShortUrl>(`${this.apiUrl}/urls/${key}`, { observe: 'response' }).pipe(            
      map(response => {
        if (response.status === 200) {
          return response.body as ShortUrl;
        } 

        return null;
      }), 
      catchError((err: any) => {
        console.error('Error fetching URL:', err);        
        return of(null); // Return null if not found
      }),
      tap(item => this._latestUrl.set(item)),  
    );
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