import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal} from '@angular/core';
import { TableComponent, TableBodyDirective, TableCaptionDirective, TableCellDirective, TableFooterDirective, TableHeadDirective, TableHeaderDirective, TableRowDirective, CopyButtonComponent, QrCodeDialogComponent, AlertDialogComponent } from '@g2mu/core/components';
import { provideUrlService, URL_SERVICE } from '../url-service';
import { ShortUrl } from '@g2mu/core/data';
import { catchError, delay, map, of, pipe, tap } from 'rxjs';
import { provideShortUrlService, SHORT_URL_SERVICE, TOASTER_SERVICE } from '@g2mu/core/services';
import { ButtonDirective, ProgressComponent, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent } from '@coreui/angular';

@Component({
    selector: 'app-list-urls',
    templateUrl: './list-urls.component.html',
    imports: [
        CommonModule,
        CopyButtonComponent,
        QrCodeDialogComponent,
        AlertDialogComponent,
        TableComponent, TableBodyDirective, TableCaptionDirective, TableCellDirective, TableFooterDirective, TableHeadDirective, TableHeaderDirective, TableRowDirective,
    ],
    providers: [provideUrlService, provideShortUrlService],
})
export class ListUrlsComponent {
    urlService = inject(URL_SERVICE);
    shortUrlService = inject(SHORT_URL_SERVICE);
    toasterService = inject(TOASTER_SERVICE);

    linksLoadingStatus = signal<'notstarted' | 'loading' | 'loaded' | 'error'>('loading');
    deleteStatus = signal<'notstarted' | 'deleting' | 'success' | 'error'>('notstarted');
    searchTerm = signal<string>('');

    allLinks = computed(() => this.urlService.urls());
    links = computed(()=>{
        var searchTerm = this.searchTerm().toLowerCase();
        var links = this.urlService.urls();
        if(searchTerm === '') {
            return links;
        }

        return links.filter(link => 
            link.key.toLowerCase().includes(searchTerm) 
            || link.longUrl.toLowerCase().includes(searchTerm.toLowerCase())
            || link.title?.toLowerCase().includes(searchTerm.toLowerCase())
            || link.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );    
    });

    // links = computed(() => this.urlService.urls());
    qrDialogParams = signal<{ open: boolean, urlKey: string, shortUrl: string }>({ open: false, urlKey: '', shortUrl: '' });
    deleteParams = signal<{ visible: boolean, link?: ShortUrl }>({ visible: false });    

    constructor() {
        this.linksLoadingStatus.set('loading');
        this.urlService.listUrls().pipe(
            tap(urls => {
                this.linksLoadingStatus.set('loaded');
            }),
            catchError(err => {
                console.error(err);
                this.linksLoadingStatus.set('error');
                return of([] as ShortUrl[]);
            })
        ).subscribe();
    }

    handleShowQRCode = (link: ShortUrl) => {
        this.qrDialogParams.set({ open: true, urlKey: link.key, shortUrl: this.shortUrlService.addDomainToKey(link.key) });
    };

    handleDeleteLink = (link: ShortUrl) => {
        this.deleteParams.set({ visible: true, link });
    }

    onQrDialogOpenChange(open: boolean) {
        this.qrDialogParams.update(prev => ({ ...prev, open }));
    }

    handleConfirmDelete = () => {
        this.deleteParams.set({ ...this.deleteParams(), visible: false });
        
        
        this.deleteStatus.set('deleting');
        this.urlService.deleteUrl(this.deleteParams().link!.key).pipe(
            tap(() => {
            console.log('Link deleted successfully');
            this.deleteStatus.set('success');
            this.toasterService.showSuccessToast('Success', 'Link deleted successfully');
            }),
            catchError(err => {
            this.deleteStatus.set('error');
            this.toasterService.showAlertToast('Error', 'Failed to delete link: ' + err.message);
            return of(null);
            })
        ).subscribe(() => {
            setTimeout(() => {
            this.deleteStatus.set('notstarted');
            this.deleteParams.set({ visible: false });
            }, 2000);
        });

    }    

    closeConfirmDelete = () => {
        console.log('Delete cancelled');
        this.deleteParams.set({ visible: false });
    }    
}