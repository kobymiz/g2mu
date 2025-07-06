// src/app/services/subscription-service.ts

import { inject, InjectionToken, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Subscription, SubscriptionPlan } from '@g2mu/core/data';
import { API_URL } from '@g2mu/core/config';

export type GenerateSubscriptionInput = {
    username: string, 
    plan: SubscriptionPlan, 
    startDatetime: Date, 
    isTrial: boolean, 
    period: 'month' | 'year',
    paymnet: {
        amount: number,
        paymentTransactionId: string,
        paymentMethod: string,
        paymentDatetime: Date
    }
    
}

/** Default subscription object */

/**
 * Shape of our Subscription service API
 */
export interface SubscriptionService {
    /** Signal holding the latest list of subscriptions */
    readonly subscriptions: Signal<Subscription[]>;    

    /** Generate a subscription object representing the data in the input */
    generateSubscription(input: GenerateSubscriptionInput): Subscription;

    /** Fetch all subscriptions for current user */
    listSubscriptions(): Observable<Subscription[]>;

    /** Fetch a single subscription by its ID */
    getSubscription(id: string): Observable<Subscription>;

    /** Create or update a subscription */
    saveSubscription(subscription: Subscription): Observable<Subscription>;

    /** Delete a subscription by its ID */
    deleteSubscription(id: string): Observable<void>;

    /** Delete a subscription by its ID */
    getLatestSubscription(): Observable<Subscription | null>
}

/** Injection token for the Subscription service */
export const SUBSCRIPTION_SERVICE = new InjectionToken<SubscriptionService>('SUBSCRIPTION_SERVICE');


/**
 * Default implementation of SubscriptionService, using HttpClient + Signals
 */
export class RemoteSubscriptionService implements SubscriptionService {    
    private http = inject(HttpClient);
    private apiUrl = inject(API_URL);

    private _subscriptions = signal<Subscription[]>([]);
    readonly subscriptions = this._subscriptions.asReadonly();

    generateSubscription(input: GenerateSubscriptionInput): Subscription {                       
        
        return {
            subscription_id: '', // to be set by backend
            username: input.username,
            planId: input.plan.id,
            createdAt: Date.now(),            
            startDatetime: input.startDatetime.getTime(),
            endDatetime: new Date(input.startDatetime.getTime() + (input.period === 'month' ? 30 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000)).getTime(),

            limits:{
                minUsers: input.plan.minUsers,
                maxUsers: input.plan.maxUsers,
                maxLinks: input.plan.maxLinks,
                maxClicks: input.plan.maxClicks
            },

            billing:{
                paymentAmount: input.paymnet.amount,
                paymentMethod: input.paymnet.paymentMethod,
                paymentDatetime: input.paymnet.paymentDatetime.getTime(),
                paymentConfirmationNumber: input.paymnet.paymentTransactionId,
            },

            active: true,            
        };
    }

    listSubscriptions(): Observable<Subscription[]> {
        return this.http
            .get<Subscription[]>(`${this.apiUrl}/subscriptions/list`)
            .pipe(
                tap(subs => this._subscriptions.set(subs))
            );
    }

    getSubscription(id: string): Observable<Subscription> {
        return this.http.get<Subscription>(`${this.apiUrl}/subscriptions/${id}`);
    }

    saveSubscription(subscription: Subscription): Observable<Subscription> {
        return this.http
            .put<Subscription>(`${this.apiUrl}/subscriptions/${subscription.subscription_id}`, subscription)
            .pipe(
                tap(saved => {
                    const list = this._subscriptions();
                    const idx = list.findIndex(s => s.subscription_id === saved.subscription_id);
                    if (idx > -1) {
                        // update existing
                        this._subscriptions.set([
                            ...list.slice(0, idx),
                            saved,
                            ...list.slice(idx + 1)
                        ]);
                    } else {
                        // add new
                        this._subscriptions.set([...list, saved]);
                    }
                })
            );
    }

    deleteSubscription(id: string): Observable<void> {
        return this.http
            .delete<void>(`${this.apiUrl}/subscriptions/${id}`)
            .pipe(
                tap(() => {
                    this._subscriptions.set(
                        this._subscriptions().filter(s => s.subscription_id !== id)
                    );
                })
            );
    }

    getLatestSubscription(): Observable<Subscription | null> {
        return this.http.get<Subscription>(`${this.apiUrl}/subscriptions/latest`);
    }
}

/** Provider you can add to your module’s `providers:` */
export const provideSubscriptionService = {
    provide: SUBSCRIPTION_SERVICE,
    useClass: RemoteSubscriptionService,
};
