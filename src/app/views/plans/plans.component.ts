import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeHeaderComponent } from '../home/header/header.component';
import { PlansContainerComponent } from './plans-container/plans-container.component';
import { provideSubscriptionPlansService, SUBSCRIPTION_PLANS_SERVICE, SubscriptionPlansService } from './subscription-plans.service';
import { AuthService } from '@g2mu/core/auth';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
  imports: [
    CommonModule,    
    RouterModule, 
    HomeHeaderComponent, 
    PlansContainerComponent
  ],  
  providers: [provideSubscriptionPlansService]
})
export class PlansComponent {   
  private service = inject(SUBSCRIPTION_PLANS_SERVICE);  
  
  protected isLoggedIn = signal(true);

  constructor(private auth: AuthService  ){
    this.service.listPlans().subscribe(plans => {
      console.log(plans);
    });

    effect(async ()=>{
      var isLoggedIn = await this.auth.isLoggedIn();
      this.isLoggedIn.set(isLoggedIn);
      console.log('Is logged in:', isLoggedIn);
    });
  }
}
