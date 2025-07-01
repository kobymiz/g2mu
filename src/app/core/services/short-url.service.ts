import { Injectable, InjectionToken } from '@angular/core';
import {customAlphabet} from 'nanoid';
import * as QRCode from 'qrcode';
import { BehaviorSubject, Observable } from 'rxjs';

export const SHORT_URL_SERVICE = new InjectionToken<ShortUrlService>('SHORT_URL_SERVICE');

// Define a constant for the unique ID length
const UNIQUE_ID_LENGTH = 8;

// Define a constant for the domain
const DOMAIN = 'https://g2mu.com'

// generate a unique ID using nanoid
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', UNIQUE_ID_LENGTH);

// Define the ShortUrl interface
export interface ShortUrlInfo {
    originalUrl: string;
    output: {
        uniqueId: string;
        domain: string;
        url: string;
    }    
}

@Injectable({ providedIn: 'root' })
export class ShortUrlService {    
    private static shortUrlSubject = new BehaviorSubject<ShortUrlInfo | null>(null);
    private static qrCodeSubject = new BehaviorSubject<string>('');
    
    private get shortUrlSubject() {
        return ShortUrlService.shortUrlSubject;
    }

    private get qrCodeSubject() {
        return ShortUrlService.qrCodeSubject;
    }

    public shortUrl$ = (): Observable<ShortUrlInfo | null> =>{
        return this.shortUrlSubject.asObservable();
    }

    public qrCode$ = (): Observable<string> =>{
        return this.qrCodeSubject.asObservable();
    }

    public clear = (): void => {
        this.shortUrlSubject.next(null);
        this.qrCodeSubject.next('');
    }

    public generateKey = (): string => {
        return nanoid();    
    }

    public addDomainToKey = (key: string) =>{
        return `${DOMAIN}/${key}`;
    }

    public shortenUrl = (originalUrl: string, key = nanoid()): ShortUrlInfo =>{        
        const shortUrl = {
            originalUrl,
            output: {
                uniqueId: key,
                domain: DOMAIN,
                url: `${DOMAIN}/${key}`
            }
        };
        this.shortUrlSubject.next(shortUrl);
        return shortUrl;
    }

    public async generateQRCode(url:string): Promise<string> {
        
        try {
            const qrCode = await QRCode.toDataURL(url);
            console.log('QR Code generated successfully:', qrCode);
            this.qrCodeSubject.next(qrCode);
            
            return qrCode;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }    
}

// Provide the service using the token
export const provideShortUrlService = {
    provide: SHORT_URL_SERVICE,
    useClass: ShortUrlService,
};

// Usage example in a standalone component or service
// const shortUrlService = inject(SHORT_URL_SERVICE);