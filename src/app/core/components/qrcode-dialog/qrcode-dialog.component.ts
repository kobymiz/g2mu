// qr-code-dialog.component.ts
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  ElementRef,
  input,
  output,
  effect,
  signal,
  AfterViewInit,
} from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code-dialog',
  standalone: true,
  templateUrl: './qrcode-dialog.component.html',
  imports: [CommonModule],
   animations: [
    trigger('fadeInOut', [
      // when the element is inserted…
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      // when it’s removed…
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class QrCodeDialogComponent {
  // inputs/outputs via the new signals API
  open     = input<boolean>(false);
  openChange = output<boolean>();
  urlKey      = input<string>('');
  shortUrl = input<string>('');

  // internal holder for the ElementRef
  canvasElRef!: ElementRef<HTMLCanvasElement>;

  // whenever the <canvas> is created/destroyed, this setter runs
  @ViewChild('canvasEl', { static: false })
  set canvasEl(v: ElementRef<HTMLCanvasElement>) {
    this.canvasElRef = v;
    // if we're open and we have a URL, draw immediately
    if (this.open() && this.urlKey() && this.canvasElRef) {
      this.generateQRCode();
    }
  }

  qrCodeDataUrl = signal('');
  isGenerating   = signal(false);

  constructor() {
    // also watch for open/url changes—only runs if canvasElRef is already set
    effect(() => {
      if (this.open() && this.urlKey() && this.canvasElRef) {
        this.generateQRCode();
      }
    });
  }

  private async generateQRCode() {
    const canvas = this.canvasElRef.nativeElement;
    const opts = { width: 300, margin: 2, color: { dark: '#000', light: '#FFF' } };

    this.isGenerating.set(true);
    try {
      await QRCode.toCanvas(canvas, this.urlKey(), opts);
      this.qrCodeDataUrl.set(await QRCode.toDataURL(this.urlKey(), opts));
      console.log('QR code generated');
    } catch (err) {
      console.error('Failed to generate QR code', err);
    } finally {
      this.isGenerating.set(false);
    }
  }

  downloadQRCode() {
    const canvas = this.canvasElRef.nativeElement;
    const link = document.createElement('a');
    link.download = `qr-code-${this.shortUrl()}.png`;
    link.href     = canvas.toDataURL('image/png');
    link.click();
    console.log(`Downloaded QR code as qr-code-${this.shortUrl()}.png`);
  }

  copyQRCode() {
    const canvas = this.canvasElRef.nativeElement;
    canvas.toBlob(async blob => {
      if (!blob) {
        console.error('No blob to copy');
        return;
      }
      try {
        await navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ]);
        console.log('QR code image copied to clipboard');
      } catch {
        await navigator.clipboard.writeText(this.qrCodeDataUrl());
        console.log('QR code data URL copied to clipboard');
      }
    }, 'image/png');
  }

  close() {
    this.openChange.emit(false);
  }
}
