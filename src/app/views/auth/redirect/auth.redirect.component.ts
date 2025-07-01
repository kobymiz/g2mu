import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; // For programmatic navigation
import { Hub } from '@aws-amplify/core'; // Import Hub from @aws-amplify/core
import { getCurrentUser, AuthError } from '@aws-amplify/auth'; // Import specific auth functions

@Component({
    selector: 'app-redirect',
    template: `
        <div class="redirect-container">
            <h2>{{ message }}</h2>
            <p>Please wait while we complete your authentication...</p>
            <div class="spinner"></div>
        </div>
    `,    
})
export class RedirectComponent implements OnInit, OnDestroy {

    message: string = 'Completing your sign-in...';

    constructor(private router: Router) { }

    ngOnInit(): void {
        // 1. Set up the Amplify Hub listener for 'auth' events
        Hub.listen('auth', this.authListener);

        // 2. Immediately try to check if the user is already authenticated.
        // This handles cases where the component re-renders or if Amplify's
        // initial processing is quick and the 'signedIn' event fires before listener is fully set up.
        this.checkUser();
    }

    // Define the listener function outside ngOnInit so it can be referenced for removal
    authListener = (data: any) => {
        switch (data.payload.event) {
            case 'signedIn': // For Amplify v6, the success event for sign-in is 'signedIn'
                console.log('User signed in:', data.payload.data);
                this.message = 'Sign-in successful! Redirecting...';
                // User is signed in. Redirect to your main app.
                this.router.navigate(['/dashboard']); // Adjust to your main app route
                break;
            case 'signedOut':
                console.log('User signed out');
                this.message = 'You have been signed out.';
                this.router.navigate(['/home']); // Redirect to login after sign out
                break;
            case 'signInWithRedirect_failure': // Event for redirect failures specifically
                console.error('Sign-in with redirect failed:', data.payload.data);
                this.message = 'Sign-in failed. Please try again.';
                //this.router.navigate(['/auth/login'], { queryParams: { error: 'signin_failed' } });
                break;
            case 'oAuthSignIn': // This event can also indicate the start/progress of OAuth flow
                console.log('OAuth Sign In event:', data.payload.data);
                // You might see this before 'signedIn' for a successful flow
                break;
            // Other events from @aws-amplify/auth can be found in the Amplify documentation
            default:
                console.log('Auth Hub event:', data.payload.event, data.payload.data);
                break;
        }
    };

    async checkUser(): Promise<void> {
        try {
            const user = await getCurrentUser(); // Use getCurrentUser for Amplify v6
            console.log('User already authenticated:', user);
            this.message = 'User already authenticated. Redirecting...';
            //this.router.navigate(['/dashboard']);
        } catch (error: any) { // Type the error as 'any' or AuthError if you want to be specific
            // This is expected on the initial redirect if the Hub listener hasn't completed the session yet.
            // If it's an actual error preventing authentication, you might want to handle it here.
            if (error instanceof AuthError) {
                 console.log('Auth Error (expected on initial redirect, or an actual error):', error.message);
            } else {
                 console.log('Unexpected Error during user check:', error);
            }
        }
    }

    ngOnDestroy(): void {
        // 3. Clean up the Hub listener when the component is destroyed
        //Hub.remove('auth', this.authListener);
        console.log('Auth Hub listener removed.');
    }
}