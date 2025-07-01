import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToggleButtonComponent } from '@g2mu/core/components';
@Component({
  selector: 'app-plans-container',
  templateUrl: './plans-container.component.html',  
  imports: [
    CommonModule,
    ToggleButtonComponent
  ],  
})
export class PlansContainerComponent {    
    period = signal<string>('monthly');
}
