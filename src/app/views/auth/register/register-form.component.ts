import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@g2mu/core/auth';
import { ResendConfirmationEmailButtonComponent } from '../resend-confirmation-email/resend-confirmation-email.component';

@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ResendConfirmationEmailButtonComponent]
})
export class RegisterFormComponent {
    registerForm: FormGroup;    
    error: string | null = null;
    
    registering = signal(false);
    confirmAccount = signal(false);    

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validators: (group: FormGroup) => {
            const password = group.get('password')?.value;
            const confirmPassword = group.get('confirmPassword')?.value;
            return password === confirmPassword ? null : { passwordMismatch: true };
            }
        });
    }  
    
    async onSubmit() {
        this.error = null; // Reset error message on submit        
        if (this.registerForm.valid) {
            this.registering.set(true); // Set loading state       
            const {username, password, acceptTerms} = this.registerForm.value;
            console.log("Creating user with username:", username, "and password:", password);

            // Handle registration logic here
            console.log('Register form value:', this.registerForm.value);
            var success = await this.authService.register(
                username, 
                username, 
                this.registerForm.value.password);
            if (!success) {
                console.error('Registration failed');     
                this.error = 'Registration failed. Please try again.';           
            } else{
                this.error = null; // Clear error on success
                this.confirmAccount.set(true); // Set success state
            }

            this.registering.set(false);
        }        
    }     
}