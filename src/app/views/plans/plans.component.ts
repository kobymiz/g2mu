import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeHeaderComponent } from '../home/header/header.component';
import { PlansContainerComponent } from './plans-container/plans-container.component';

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
})
export class PlansComponent {    
}
