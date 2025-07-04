import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleButtonComponent } from '@g2mu/core/components';
import { provideSubscriptionPlansService, SUBSCRIPTION_PLANS_SERVICE } from '../subscription-plans.service';
@Component({
  selector: 'app-plans-container',
  templateUrl: './plans-container.component.html',  
  imports: [
    CommonModule,
    ToggleButtonComponent
  ],    
})
export class PlansContainerComponent { 
    private service = inject(SUBSCRIPTION_PLANS_SERVICE);   
  
    protected period = signal<string>('monthly');
    protected items = this.service.items;
    protected loading = this.service.loading;
}
