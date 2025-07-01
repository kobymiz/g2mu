import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-copy-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="handleCopy()"
      [ngClass]="btnClasses()"
      [attr.aria-label]="ariaLabel()"
    >
      <i [ngClass]="iconClasses()"></i>
      <span *ngIf="variant() === 'button'">
        {{ hasCopied() ? 'Copied!' : 'Copy' }}
      </span>
    </button>
  `,
})
export class CopyButtonComponent {
  /** Required text to copy */
  readonly value = input.required<string>();
  /** 'icon' or 'button' */
  readonly variant = input<'icon' | 'button'>('icon');
  /** Additional CSS classes for the button */
  readonly className = input<string>('');

  protected hasCopied = signal(false);

  /** Compute aria-label for icon-only variant */
  ariaLabel() {
    return this.variant() === 'icon'
      ? this.hasCopied() ? 'Copied' : 'Copy'
      : undefined;
  }

  /** Compute button CSS classes */
  btnClasses() {
    const base = this.variant() === 'icon'
      ? 'p-1 text-gray-400 hover:text-primary'
      : 'inline-flex items-center h-8 gap-1 px-2 border rounded';
    return `${base} ${this.className()}`.trim();
  }

  /** Compute FontAwesome icon classes */
  iconClasses() {    
    const icon = this.hasCopied() ? 'fa-solid fa-check' : 'fa-regular fa-copy';
    const size = this.variant() === 'icon' ? 'h-4 w-4' : 'h-3 w-3';
    return [icon, size].join(' ');
  }

  async handleCopy() {
    try {
      await navigator.clipboard.writeText(this.value());
      this.hasCopied.set(true);
      setTimeout(() => this.hasCopied.set(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  }
}
