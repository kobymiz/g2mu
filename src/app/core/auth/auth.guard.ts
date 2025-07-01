import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { DEFAULT_REDIRECT_URL_AUTH_USER } from '../services/redirect.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {  
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(route:ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const loggedIn = await this.auth.isLoggedIn();
    const url = route.routeConfig?.path;
    if(!url) return true;
    
    if (url.startsWith('app') && !loggedIn) {
      return this.router.parseUrl('/auth/login');
    }
    if (url === 'home' && loggedIn) {
      return this.router.parseUrl(DEFAULT_REDIRECT_URL_AUTH_USER);
    }
    return true;
  }
}