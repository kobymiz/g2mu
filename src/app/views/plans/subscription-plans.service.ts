// src/app/services/url-service.ts

import { inject, InjectionToken, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { SubscriptionPlan } from '@g2mu/core/data';
import { API_URL } from '@g2mu/core/config';

/**
 * Shape of our service API
 */
export interface SubscriptionPlansService {
  /** Signal holding the latest list */
  readonly items: Signal<SubscriptionPlan[]>;

  readonly loading: Signal<boolean>;

  /** Fetch all URLs for current user */
  listPlans(): Observable<SubscriptionPlan[]>;

  /** Fetch single URL by key */
  getPlan(id: string): Observable<SubscriptionPlan>;  
}

/** Injection token for the URL service */
export const SUBSCRIPTION_PLANS_SERVICE = new InjectionToken<SubscriptionPlansService>('SUBSCRIPTION_PLANS_SERVICE');


/**
 * Default implementation of UrlService, using HttpClient + Signals
 */
export class RemoteSubscriptionPlansService implements SubscriptionPlansService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);

  private _items = signal<SubscriptionPlan[]>([]);
  private _loading = signal(false);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();

  listPlans(): Observable<SubscriptionPlan[]> {
    this._loading.set(true);
    return this.http.get<SubscriptionPlan[]>(`${this.apiUrl}/plans/list`).pipe(
      map(items => items.slice().sort((a, b) => a.id.localeCompare(b.id))),
      tap(items => this._items.set(items)),
      tap(() => this._loading.set(false))
    );
  }

  getPlan(id: string): Observable<SubscriptionPlan> {
    this._loading.set(true);
    return this.http.get<SubscriptionPlan>(`${this.apiUrl}/plans/${id}`).pipe(
      tap(() => this._loading.set(false))
    );
  }
}

export const provideSubscriptionPlansService = {
    provide: SUBSCRIPTION_PLANS_SERVICE,
    useClass: RemoteSubscriptionPlansService,
};