import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@g2mu/core/auth';
import { ResendConfirmationEmailButtonComponent } from '../resend-confirmation-email/resend-confirmation-email.component';
import { provideRedirectService, REDIRECT_SERVICE } from '@g2mu/core/services';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    imports: [
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        ResendConfirmationEmailButtonComponent
    ],
    providers: [provideRedirectService],
})
export class LoginFormComponent {
    redirectService = inject(REDIRECT_SERVICE);
    loginForm: FormGroup;    
    error = signal('');
    signInStatus = signal<'' | 'signingIn' | 'success' | 'error' | 'pending-signup-confirmation'>('');    

    constructor(
        private fb: FormBuilder,  
        private auth: AuthService      
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [false]
        });        
    }  
    
    onSubmit = async () => {
        this.signInStatus.set('');

        if (this.loginForm.invalid) {                        
            return;
        }
        try{
            this.signInStatus.set('signingIn');
            this.error.set('');

            const { username, password } = this.loginForm.value;
            console.log('Login attempt with', username, password);

            var response = await this.auth.login(username, password);
            if(response.success) {
                this.signInStatus.set('success');    
                this.redirectService.redirectAfterLogin();
            } else if(response.awaitConfirmation) {
                this.signInStatus.set('pending-signup-confirmation');
            } else if(response.error) {
                this.signInStatus.set('error');
                this.error.set(response.error || 'Invalid credentials');
            }
        } catch (error) {
                this.signInStatus.set('error');
                const errorMessage = (error instanceof Error) ? error.message : (typeof error === 'string' ? error : 'Invalid credentials');
                this.error.set(errorMessage);
        }          
    }

    onForgotPassword = async () => {
        this.error.set('');
        var {username} = this.loginForm.value;
        if(!username) {
            this.error.set('Please enter your username to reset your password.');
            return;
        }
        
        try {
            await this.auth.resetPassword(username);
        }catch (error) {
            this.error.set('Failed to reset password. Please check your user name and try again.');
        }
        console.log('onForgotPassword');        
    }
}