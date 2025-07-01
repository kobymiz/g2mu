import { CommonModule } from '@angular/common';
import { AuthService } from './../../core/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {signOut} from '@aws-amplify/auth';
import { User } from '@g2mu/core/auth';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [CommonModule],
})
export class DashboardComponent implements OnInit {    
    loggedUser: User | null = null;
    
    constructor(private router: Router, private auth: AuthService) {}

    async ngOnInit() {
        try {
            this.loggedUser = await this.auth.getCurrentUser();
            console.log('Logged user:', this.loggedUser);            
        } catch (error) {
            this.loggedUser = null;
            // Inject Router and use it for navigation
            this.router.navigate(['/home']);
            console.error('Error fetching logged user:', error);
        }
    }

    async logout() {
        try {
            await signOut();
            //await this.auth.signOut();
        }catch (error) {
            console.error('Error during logout:', error);
        }        
    }   
}