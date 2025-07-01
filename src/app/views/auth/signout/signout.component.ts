import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; // For programmatic navigation
import { Hub } from '@aws-amplify/core'; // Import Hub from @aws-amplify/core
import { getCurrentUser, AuthError } from '@aws-amplify/auth'; // Import specific auth functions

@Component({
    selector: 'app-signout',
    template: `
        <div>
            <h1>Signing you out....</h1>            
            <div class="spinner"></div>
        </div>
    `,    
})
export class SignoutComponent {
    
    constructor(private router: Router) { }

    ngOnInit(): void {
        this.router.navigate(['/home'])
    }
}