import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeHeaderComponent } from './header/header.component';
import { ShortUrlSampleFormComponent } from './form/sample-form.component';
import { MainFeaturesSectionComponent } from './main-features/main-features.component';
import { ShortUrlViewerComponent } from '@g2mu/core/components';
import { provideShortUrlService, SHORT_URL_SERVICE, ShortUrlInfo } from '@g2mu/core/services';
import { animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,    
    RouterModule, 
    HomeHeaderComponent, 
    ShortUrlSampleFormComponent, 
    MainFeaturesSectionComponent,
    ShortUrlViewerComponent],
  providers: [provideShortUrlService],

  animations: [
    trigger('growDown', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent {
  shortUrlService = inject(SHORT_URL_SERVICE);

  protected shortUrl = signal<ShortUrlInfo | null>(null);
  protected qrCode = signal<string>('');

  constructor() {
    this.shortUrlService.shortUrl$().subscribe((shortUrl) => {
      this.shortUrl.set(shortUrl);
      console.log('Short URL updated:', shortUrl);
    });
    this.shortUrlService.qrCode$().subscribe((qrCode) => {
      this.qrCode.set(qrCode);
      console.log('QR Code updated:', qrCode);
    });
  }

}
