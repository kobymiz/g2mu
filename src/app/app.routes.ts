import { AuthGuard } from './core/auth/auth.guard';
import { Routes } from '@angular/router';
import { slugMatcher } from './views/slug-lookup/slug-matcher';
import { provideShortUrlService } from './core/services';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./views/auth').then(m => m.routes),
  },
  {
    path: 'home',
    loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent),    
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },  
  {
    path: 'plans',
    loadComponent: () => import('./views/plans/plans.component').then(m => m.PlansComponent),    
    pathMatch: 'full'    
  },  
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent),
        pathMatch: 'full'
      },
      // {
      //   path: 'analytics',
      //   loadComponent: () => import('./views/analytics/analytics.component').then(m => m.AnalyticsComponent),
      //   pathMatch: 'full'
      // },
      {
        path: 'url/create',
        loadComponent: () => import('./views/app/url/create/create-url.component').then(m => m.CreateUrlComponent),
        pathMatch: 'full'
      },
      {
        path: 'url/list',
        loadComponent: () => import('./views/app/url/list/list-urls.component').then(m => m.ListUrlsComponent),
        pathMatch: 'full'
      },
      // {
      //   path: 'settings',
      //   loadComponent: () => import('./views/settings/settings.component').then(m => m.SettingsComponent),
      //   pathMatch: 'full'
      // },
      {
        path: 'plans',
        loadComponent: () => import('./views/plans/plans.component').then(m => m.PlansComponent),    
        pathMatch: 'full'    
      },        
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },     
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },  
  {
    matcher: slugMatcher,
    providers: [provideShortUrlService],
    loadComponent: () =>
    import('./views/slug-lookup/slug-lookup.component').then(m => m.SlugLookupComponent),
  },
  { path: '**', redirectTo: 'home' }
];
