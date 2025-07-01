import { Component, computed, HostListener, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective, CollapseDirective, ContainerComponent, DropdownComponent, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, FormControlDirective, FormDirective, NavbarBrandDirective, NavbarComponent, NavbarModule, NavbarNavComponent, NavbarTogglerDirective, NavItemComponent, NavLinkDirective } from '@coreui/angular';
import { FeaturesMenuComponent } from './features/features-menu.component';
import { UseCasesMenuComponent } from './usecases/usecases-menu.component';
import { PricingMenuComponent } from './pricing/pricing-menu.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',  
  imports: [
  CommonModule,
  ButtonDirective,
  CollapseDirective,
  ContainerComponent,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  FormControlDirective,
  FormDirective,
  NavbarBrandDirective,
  NavbarComponent,
  NavbarNavComponent,
  NavbarTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  FeaturesMenuComponent, UseCasesMenuComponent, PricingMenuComponent],
})
export class AppNavbarComponent {
  protected isFeaturesOpen = false;
  protected isUsecasesOpen = false;
  protected isPricingOpen = false;
  
  menuItemTextColor = computed(()=> 'text-gray-900');
      
}
