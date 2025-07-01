import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { AuthService } from '@g2mu/core/auth';

@Component({
    selector: 'app-resend-confirmation-email-button',
    template: `    
    <button type="button" class="btn btn-sm btn-outline-{{style() || 'success'}} mt-2" (click)="resendConfirmationEmail()" [disabled]="username() === '' || resendConfirmationStatus() === 'resending'">
        <span *ngIf="resendConfirmationStatus()==='resending'" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <span *ngIf="resendConfirmationStatus()==='success'" class="fa fa-check-circle me-2" role="status" aria-hidden="true"></span>
        <span *ngIf="resendConfirmationStatus()==='error'" class="fa fa-exclamation-triangle me-2" role="status" aria-hidden="true"></span>
        {{
            resendConfirmationStatus()===''
            ? "Resend Confirmation Email"
            : resendConfirmationStatus()==='success' ? "Confirmation Email Sent"
            : resendConfirmationStatus()==='resending' ? "Resending Confirmation Email..."
            : "Error Resending Email"
        }}
    </button>
    `,
    imports: [CommonModule],
})
export class ResendConfirmationEmailButtonComponent {    
    username = input.required<string>();
    style = input<string>('success');

    protected resendConfirmationStatus = signal<'' | 'resending' | 'success' | 'error'>('');
    private authService = inject(AuthService);
    
    

    protected resendConfirmationEmail = async () => {                
        this.resendConfirmationStatus.set(''); // Reset status before resending
        try {
            this.resendConfirmationStatus.set('resending'); // Set loading state            
            
            await this.authService.resendConfirmationEmail(this.username());    
            
            this.resendConfirmationStatus.set('success'); // Reset loading state
            
        } catch (error) {
            this.resendConfirmationStatus.set('error'); // Reset loading state
            console.error('Error resending confirmation email:', error);            
        }
    }
}