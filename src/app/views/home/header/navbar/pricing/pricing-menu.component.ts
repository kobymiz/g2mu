import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';



@Component({
  selector: 'app-pricing-menu',
  templateUrl: './pricing-menu.component.html',  
  imports: [CommonModule],
})
export class PricingMenuComponent {  
  pricingOptions = [
    { name: 'Free Plan', price: '0', description: 'Get Started today, no cost, no commitment' },
    { name: 'Standard Plan', price: '10', description: 'For professionals, advanced analytics, free trial available' },
    { name: 'Team Plans', price: '15', description: 'For Teams, Collaboration & management' }
  ];
}
