import { Component, inject, WritableSignal, signal } from '@angular/core';
import { provideShortUrlService, SHORT_URL_SERVICE, ShortUrlInfo } from '@g2mu/core/services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sample-form',
  template: `
   <div class="p-3 mt-3 bg-dark text-white rounded-xl w-full text-left">
    <label class="form-label fs-5">
      Try our Platform
    </label>
    <form class="flex gy-2 gx-3 mb-3">
      <input type="text" class="form-control me-2" id="txtLongURL" placeholder="Paste your long URL here" [(ngModel)]="longUrl" name="longUrl" />
      <button class="btn btn-primary btn text-nowrap" type="button" (click)="onGenerateUrlClick()">
      <i class="fa fa-link me-2"></i>Create Short URL
      </button>
    </form>
    </div>
  `, 
  providers: [provideShortUrlService],
  imports: [FormsModule],

})
export class ShortUrlSampleFormComponent {
  protected service = inject(SHORT_URL_SERVICE);
  protected longUrl: string = '';  
  
  protected shortUrl: WritableSignal<ShortUrlInfo | null> = signal(null);
  protected qrCode: string | null = null;

  constructor() {
  this.service.shortUrl$().subscribe((shortUrl) => {
    this.shortUrl.set(shortUrl);      
    if(shortUrl != null){
      this.service.generateQRCode(shortUrl.output.url);
    }
    
  });
  }
  protected onGenerateUrlClick(){  
    this.service.shortenUrl(this.longUrl);  
  };
}