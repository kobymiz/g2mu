import { Component, effect, inject, input, signal} from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SHORT_URL_SERVICE, ShortUrlInfo } from '@g2mu/core/services';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { signInWithRedirect } from '@aws-amplify/auth';
import { AuthService } from '@g2mu/core/auth';

@Component({
    selector: 'app-shorturl-viewer',
    templateUrl: './short-url-viewer.component.html',
    imports: [CommonModule, ClipboardModule, RouterModule],
    
})
export class ShortUrlViewerComponent { 
    protected shortUrlService = inject(SHORT_URL_SERVICE);    

     shortUrl = input.required<ShortUrlInfo | null>({alias: 'data'});
     qrCode = input.required<string>({alias: 'qrCode'});
     busy = signal(false);     
     isLoggedIn = signal(false);
     protected copied = signal(false);

     constructor(protected authService: AuthService) {        
        effect(() => {
            console.log('QR Code changed:', this.qrCode());
        });       
        
        effect(async() => {
            this.isLoggedIn.set(await this.authService.isLoggedIn());
        });
     }

     signInWithGoogle(): void {
             console.log("Sign in with Google clicked");
             try{                 
                 signInWithRedirect({ provider: 'Google' });
                 this.busy.set(true);
             } catch (error) {                 
                 console.error('Google login failed', error);                             
                 this.busy.set(false);
             }
             
         }
}