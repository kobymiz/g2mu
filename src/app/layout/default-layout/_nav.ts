import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/app/dashboard',
    icon: 'fa-solid fa-chart-column',    
  },  
  {
    name: 'Create URL',
    url: '/app/url/create',    
    icon: 'fa-regular fa-square-plus',
  },
  {
    name: 'My URLs',
    url: '/app/url/list',    
    icon: 'fa-solid fa-link',
  },
  {
    name: 'Analytics',
    url: '/app/analytics',    
    icon: 'fa-solid fa-chart-line',
  },

  
  {
    name: 'Settings',
    url: '/app/settings',
    iconComponent: { name: 'cil-settings' },
    children: [
      {
        name: 'Profile',
        url: '/app/settings/profile',
        iconComponent: { name: 'cil-user' }
      },
      {
        name: 'Email Preferences',
        url: '/app/settings/email-preferences',
        iconComponent: { name: 'cil-envelope-closed' }
      },
      {
        name: 'Billing & Plans',
        url: '/app/settings/billing',
        iconComponent: { name: 'cil-dollar' }
      },
      
    ]
  },    
];
