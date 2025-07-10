import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { provideUrlService, URL_SERVICE } from '../app/url/url-service';
import { ShortUrl } from '@g2mu/core/data';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { provideRedirectService, REDIRECT_SERVICE } from '@g2mu/core/services';


@Component({
    selector: 'app-slug-lookup',
    templateUrl: './slug-lookup.component.html',
    providers: [provideUrlService, provideRedirectService],
    imports: [CommonModule],
})
export class SlugLookupComponent {
    private service = inject(URL_SERVICE);
    private redirect = inject(REDIRECT_SERVICE)
    private slug$ = new BehaviorSubject<string | null>(null);
    private url$ = new Subject<ShortUrl>();

    slug = signal('');    
    url = signal<ShortUrl | null>(null);
    status = signal<'idle' | 'loading' |'loaded' | 'notfound' | 'error'>('idle');
    error = signal<string | null>(null);

    urlString = computed(() => {
        console.log('Computed URL string called');
        const url = this.url();
        return url ? JSON.stringify(url, null, 2) : "null";
    });            

    constructor(private route: ActivatedRoute) {
        this.parseRoute();                
        this.initSlugListener();
        this.initUrlListener();
    }

    private parseRoute(){
        this.route.url.subscribe(segments => {
            const path = segments.map(segment => segment.path).join('/');
            if (path) {
                this.slug.set(path.split('/')[0]);
                this.slug$.next(this.slug());                
                console.log('Initial slug from URL:', this.slug());                
            }
        });
    }

    private initSlugListener() {
        this.slug$.subscribe(async (slug) => {            
            if (slug) {
                this.status.set('loading');
                this.error.set(null);
                try {
                    const url = await firstValueFrom(this.service.getUrl(slug));
                    if (url) {
                        this.url.set(url);
                        this.url$.next(url);
                        this.status.set('loaded');
                    } else {
                        this.status.set('notfound');
                    }
                } catch (err) {
                    console.error('Error fetching URL:', err);
                    this.status.set('error');
                    this.error.set(err instanceof Error ? err.message : 'Unknown error');
                }
            } else {
                this.status.set('idle');
            }
        });
    }

    private initUrlListener() {
        this.url$.subscribe((url) => {
            this.redirect.redirectToAbsoluteURL(url.longUrl);
        });
    }
}