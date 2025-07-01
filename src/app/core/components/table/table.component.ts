import { Component, Directive, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Wrapper for native <table> to handle overflow.
 */
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full overflow-auto">
      <table class="w-full caption-bottom text-sm">
        <ng-content></ng-content>
      </table>
    </div>
  `,
})
export class TableComponent { }

/**
 * Directive for <thead> styling
 */
@Directive({ selector: 'thead[appTableHeader]' })
export class TableHeaderDirective {
  @HostBinding('class')
  get classes(): string {
    const base = '[&_tr]:border-b';
    return `${base} ${this.className || ''}`.trim();
  }
  @Input() className?: string;
}

/**
 * Directive for <tbody> styling
 */
@Directive({ selector: 'tbody[appTableBody]' })
export class TableBodyDirective {
  @HostBinding('class')
  get classes(): string {
    const base = '[&_tr:last-child]:border-0';
    return `${base} ${this.className || ''}`.trim();
  }
  @Input() className?: string;
}

/**
 * Directive for <tfoot> styling
 */
@Directive({ selector: 'tfoot[appTableFooter]' })
export class TableFooterDirective {
  @HostBinding('class')
  get classes(): string {
    const base = 'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0';
    return `${base} ${this.className || ''}`.trim();
  }
  @Input() className?: string;
}

/**
 * Directive for <tr> styling
 */
@Directive({ selector: 'tr[appTableRow]' })
export class TableRowDirective {
  @HostBinding('class')
  get classes(): string {
    const base = 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted';
    return `${base} ${this.className || ''}`.trim();
  }
  @Input() className?: string;
}

/**
 * Directive for <th> styling
 */
@Directive({ selector: 'th[appTableHead]' })
export class TableHeadDirective {
  @HostBinding('class')
  get classes(): string {
    const base = 'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0';
    return `${base} ${this.className || ''}`.trim();
  }
  @Input() className?: string;
}

/**
 * Directive for <td> styling
 */
@Directive({ selector: 'td[appTableCell]' })
export class TableCellDirective {
  @HostBinding('class')
  get classes(): string {
    const base = 'p-4 align-middle [&:has([role=checkbox])]:pr-0';
    return `${base} ${this.className || ''}`.trim();
  }
  @Input() className?: string;
}

/**
 * Directive for <caption> styling
 */
@Directive({ selector: 'caption[appTableCaption]' })
export class TableCaptionDirective {
  @HostBinding('class')
  get classes(): string {
    const base = 'mt-4 text-sm text-muted-foreground';
    return `${base} ${this.className || ''}`.trim();
  }
  @Input() className?: string;
}
