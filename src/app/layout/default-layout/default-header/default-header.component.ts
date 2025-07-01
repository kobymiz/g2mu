import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective,
  ToastComponent, 
  ToastBodyComponent,
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '@g2mu/core/auth';
import { REDIRECT_SERVICE, provideRedirectService } from '@g2mu/core/services';

@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',   
    providers: [provideRedirectService], 
  imports: [
    ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ToastComponent, ToastBodyComponent]
})
export class DefaultHeaderComponent extends HeaderComponent { 
  redirectService = inject(REDIRECT_SERVICE); 
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  constructor(private authService: AuthService) {
    super();
  }

  sidebarId = input('sidebar1');

  logout = async ()=> {
    await this.authService.signOut();
    this.redirectService.redirectAfterSignout();
  }
}
