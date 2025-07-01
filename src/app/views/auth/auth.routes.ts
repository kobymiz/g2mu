import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: ':mode',
    loadComponent: async () => (await import('./auth.component')).AuthComponent,    
    children: [      
      {
        path: 'redirect',
        loadComponent: async () => (await import('./redirect')).RedirectComponent,                
      },
      {
        path: 'signout',
        loadComponent: async () => (await import('./signout')).SignoutComponent,                
      }
    ]
  },
];
