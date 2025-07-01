import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@g2mu/core/auth';
import { TypeaheadDirective } from '@g2mu/core/directives';
import { Observable, firstValueFrom } from 'rxjs';
import {provideUrlService, URL_SERVICE} from '../url-service';

import { map, tap } from 'rxjs/operators';
import { provideShortUrlService, SHORT_URL_SERVICE, ShortUrlInfo } from '@g2mu/core/services';
import { CreateShortUrlRequest, ShortUrl } from '@g2mu/core/data';
import { ModalComponent, ModalModule } from '@coreui/angular';
import { ShortUrlViewerComponent } from '@g2mu/core/components';
import { provideRedirectService, REDIRECT_SERVICE } from '@g2mu/core/services';
@Component({
    selector: 'app-create-url-form',
    standalone: true,
    templateUrl: './create-url-form.component.html',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalModule, ShortUrlViewerComponent, TypeaheadDirective],
    providers: [provideUrlService, provideShortUrlService, provideRedirectService],
})
export class CreateUrlFormComponent {
    @ViewChild('successModal') successModal!: ModalComponent;
    
    urlService = inject(URL_SERVICE);
    redirectService = inject(REDIRECT_SERVICE);
    shortUrlService = inject(SHORT_URL_SERVICE);

    createUrlForm: FormGroup;
    shortUrlStatus = signal<'' | 'checking' | 'available' | 'unavailable'>('');
    submitFormStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');
    postCreateUrlAction = signal<'createAnother' | 'viewUrlPage' | 'urlListPage' |'closeModalOnly'>('closeModalOnly');
    showSuccessModal = signal<boolean>(false);    
    
    createdUrl = signal<ShortUrl | null>(null);
    createdUrlQRCode = signal<string|null>(null);
    createdUrlInfo = signal<ShortUrlInfo|null>(null);
    
    constructor(private fb: FormBuilder, private auth: AuthService) {
        this.createUrlForm = this.fb.group({
            longUrl: ['', [
                Validators.required,
                Validators.pattern('^(https?|ftps?)://.+'),
            ]],
            title: ['', Validators.required],
            description: [''],
            customUrl: ['', [
                Validators.pattern('^[a-zA-Z0-9_-]+$'),
                Validators.minLength(4),
                Validators.maxLength(12)
            ]
            ],
            rememberMe: [false]
        });

        this.createUrlForm.get('customUrl')?.valueChanges.subscribe(value => {
            if (!value) {
                this.shortUrlStatus.set('');
            }
        });

        this.shortUrlService.shortUrl$().subscribe((shortUrl) => {
            this.createdUrlInfo.set(shortUrl);
            if( shortUrl === null) {
                this.showSuccessModal.set(false);
            }            

        });

        this.shortUrlService.qrCode$().subscribe((qrCode) => {
            this.createdUrlQRCode.set(qrCode);            
        });

        // Success Modal Action Buttons click effect
        effect(() => {
            this.showSuccessModal.set(false);
            const action = this.postCreateUrlAction();
            switch (action) {
                case 'createAnother':
                    this.clearForm();
                    break;
                case 'viewUrlPage':
                    this.redirectService.redirectTo('/app/url/view/' + this.createdUrl()?.key);
                    break;
                case 'urlListPage':
                    this.redirectService.redirectTo('/app/url/list');
                    break;
            }            
        });

        // Geenrate Short url info after Url is created
        effect(()=>{
            const createdUrl = this.createdUrl();
            if(createdUrl != null){
                this.shortUrlService.shortenUrl(createdUrl.longUrl, createdUrl.key);
            }
        });

        // Generate QR code after Url is created
        effect(async () => {
            const shortUrlInfo = this.createdUrlInfo();
            if (shortUrlInfo === null) {
                return;
            }

            // Generate QR code after successful save
            if (this.createdUrlInfo() != null) {
                var url = this.createdUrlInfo()?.output.url || '';
                const qrCode = await this.shortUrlService.generateQRCode(url);
                this.createdUrlQRCode.set(qrCode);
            }
        });

        // Set success modal visibility based on showSuccessModal signal
        effect(async () => {
            const showSuccessModal = this.showSuccessModal();
            if(this.showSuccessModal()){
                this.successModal.visible = showSuccessModal;            
            }            
        });
    }

    submitForm = async () => {
        if(this.createUrlForm.invalid){
            return;
        }
        
        var item = this.createUrlForm.value;
        var request: CreateShortUrlRequest = {
            key: item.customUrl || this.shortUrlService.generateKey(),              
            longUrl: item.longUrl,
            title: item.title,
            description: item.description
        };

        this.submitFormStatus.set('submitting');
        var createdURL = await firstValueFrom(
            this.urlService.saveUrl(request).pipe(
            tap(() => {
                this.submitFormStatus.set('success');
            }),
            map(response => response),
            tap({
                error: (error) => {                
                this.submitFormStatus.set('error');
                }
            })
            )
        );

        this.createdUrl.set(createdURL);        
                
        this.clearForm();
        this.showSuccessModal.set(true);
    }

    clearForm = () => {
        this.createUrlForm.reset();
        this.submitFormStatus.set('idle');        
    } 
    

    generateShortUrl = async () => {
        let isAvailable = false;
        while (!isAvailable) {
            const key = this.shortUrlService.generateKey();
            this.createUrlForm.get('customUrl')?.setValue(key);
            const result = await firstValueFrom(this.checkShortUrl(key));
            isAvailable = result.available;
        }
    }

    checkShortUrl = (value: string): Observable<{ available: boolean }> =>{
        this.shortUrlStatus.set('checking');
        return this.urlService.checkAvailability(value).pipe(            
            map(available => {
                this.shortUrlStatus.set(available ? 'available' : 'unavailable');
                return ({ available })
            })
        );
    }            
}