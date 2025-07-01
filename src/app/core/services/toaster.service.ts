import { CommonModule } from '@angular/common';
import { Injectable, signal, InjectionToken, Component, inject, viewChild,forwardRef, Input  } from '@angular/core';
import { ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent, ToastCloseDirective } from '@coreui/angular';
import { Subject } from 'rxjs';


const addToast$ = new Subject<ToastData>();
const removeToast$ = new Subject<ToastData>();

export type ToastStyle = 'success' | 'danger' | 'warning' | 'info';

export interface ToastData {  
  color: ToastStyle;
  title: string;
  message: string;
}

@Injectable()
export class ToasterService {  
  private position: string = 'top-end'; // Default position

  public getToastPosition(): string {
    return this.position;
  }

  public showToast(style: ToastStyle, title: string, message: string) {    
    console.log(`Showing toast: ${title} - ${message}`);    
    const newToast: ToastData = {      
      color: style,
      title,
      message
    };
    addToast$.next(newToast);
    setTimeout(() => removeToast$.next(newToast), 5000);        
  }

  public showAlertToast(title: string, message: string) {
    this.showToast('danger', title, message);
  }

  public showSuccessToast(title: string, message: string) {
    this.showToast('success', title, message);
  }

  public showWarningToast(title: string, message: string) {
    this.showToast('warning', title, message);
  }
  public showInfoToast(title: string, message: string) {
    this.showToast('info', title, message);
  }  
}

export const TOASTER_SERVICE = new InjectionToken<ToasterService>(
  'TOASTER_SERVICE',
  {
    providedIn: 'root',
    factory: () => new ToasterService() // default position
  }
);


@Component({
  selector: 'app-toast-sample',
  template: `
      <ng-container>        
        <c-toast-body #toast [cToastClose]="toast.toast ?? undefined">
        <h2 class="font-semibold text-lg" [ngClass]="getHeaderTextColorClass()">
          <span *ngIf="color() === 'success'" class="fa fa-check-circle mr-2"></span>
          <span *ngIf="color() === 'danger'" class="fa fa-times-circle  mr-2"></span>
          <span *ngIf="color() === 'warning'" class="fa fa-exclamation-triangle  mr-2"></span>
          <span *ngIf="color() === 'info'" class="fa fa-info-circle  mr-2"></span>
          {{ title }}
        </h2>
          <p class="mb-1" [ngClass]="getMessageTextColorClass()">
            {{message}}            
          </p>          
        </c-toast-body>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
      }
    `
  ],
  providers: [{ provide: ToastComponent, useExisting: forwardRef(() => AppToastSampleComponent) }],
  standalone: true,
  imports: [CommonModule, ToastHeaderComponent, ToastBodyComponent, ToastCloseDirective]
})
export class AppToastSampleComponent extends ToastComponent {
  constructor() {
    super();
  }

  @Input() closeButton = true;
  @Input() title = '';
  @Input() message = '';

  getHeaderTextColorClass(): string {
    switch (this.color()) {
      case 'success':
        return 'text-green-900';
      case 'danger':
        return 'text-red-900';
      case 'warning':
        return 'text-yellow-900';
      case 'info':
        return 'text-blue-900';
      default:
        return '';
    }
  }

  getMessageTextColorClass(): string {
    switch (this.color()) {
      case 'success':
        return 'text-green-900';
      case 'danger':
        return 'text-red-900';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return '';
    }
  }
}

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent],
  template: `
    <c-toaster class="p-3" position="fixed" [placement]="toastService.getToastPosition()">        
    </c-toaster>
  `
})
export class ToastContainerComponent {
  toastService = inject(TOASTER_SERVICE);
  readonly toaster = viewChild(ToasterComponent);  
  
  constructor() {
    addToast$.subscribe((toast: ToastData) => {
      const options = {
        ...toast,        
        delay: 5000,
        placement: this.toastService.getToastPosition(),        
        autohide: true
      };
      this.toaster()?.addToast(AppToastSampleComponent, { ...options });
    });    
  }
}