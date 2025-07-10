import { Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';

export const REDIRECT_SERVICE = new InjectionToken<RedirectService>('REDIRECT_SERVICE');

export const DEFAULT_REDIRECT_URL_AUTH_USER = '/app';
export const DEFAULT_REDIRECT_URL = "/home";

@Injectable({ providedIn: 'root' })
export class RedirectService {
  private redirectUrl: string | null = null;

  constructor(private router: Router) {}

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  redirectTo(url: string) {
    this.redirectUrl = url;
    this.router.navigateByUrl(url);
  } 

  redirectAfterLogin(defaultUrl: string = DEFAULT_REDIRECT_URL) {
    const target = this.redirectUrl || defaultUrl;
    this.redirectUrl = null;
    this.router.navigateByUrl(target);
  }

  redirectAfterSignout(){        
    this.router.navigateByUrl(DEFAULT_REDIRECT_URL);
  }

  redirectToAbsoluteURL(url: string) {
    window.location.href = url;
  }
}


export const provideRedirectService = {
    provide: REDIRECT_SERVICE,
    useClass: RedirectService,
};