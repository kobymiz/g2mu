import { FormModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToggleButtonComponent } from '@g2mu/core/components';
import { LoginFormComponent } from './login';
import { RegisterFormComponent } from './register';
import { GoogleLoginButtonComponent } from './google-login/google-login.component';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    imports: [
        RouterModule, 
        CommonModule,         
        ToggleButtonComponent,
        LoginFormComponent,
        RegisterFormComponent,
        GoogleLoginButtonComponent
    ],
})
export class AuthComponent {
    route = inject(ActivatedRoute);            
    activeTab = signal('login');    

    constructor() {
        effect(() => {
            this.route.paramMap.subscribe(params => {
                this.activeTab.set(params.get('mode') || '');                
            });        
        });
    }    
}