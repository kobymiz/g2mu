// grid-container.component.ts
import { Component, computed, input, HostBinding, forwardRef } from '@angular/core';

@Component({
  selector: 'app-grid-container',
  standalone: true,  
  template: `<ng-content></ng-content>`
})
export class GridContainerComponent {
  /** Base number of grid-columns (divisor of 12) */
  readonly cols   = input.required<number>();              // [cols]="4"
  /** Optional overrides per breakpoint */
  readonly colsXs = input<number|undefined>(undefined, { alias: 'cols-xs' });
  readonly colsSm = input<number|undefined>(undefined, { alias: 'cols-sm' });
  readonly colsMd = input<number|undefined>(undefined, { alias: 'cols-md' });
  readonly colsLg = input<number|undefined>(undefined, { alias: 'cols-lg' });
  readonly colsXl = input<number|undefined>(undefined, { alias: 'cols-xl' });

  /** fall-back chain */
  readonly colXs = computed(() => this.colsXs() ?? this.cols());
  readonly colSm = computed(() => this.colsSm() ?? this.colXs());
  readonly colMd = computed(() => this.colsMd() ?? this.colSm());
  readonly colLg = computed(() => this.colsLg() ?? this.colMd());
  readonly colXl = computed(() => this.colsXl() ?? this.colLg());

  /** build the row-cols classes */
  readonly classList = computed(() => {
    return [
      'row',
      'g-3',                            // 1rem gutter
      `row-cols-${ this.colXs() }`,
      `row-cols-sm-${ this.colSm() }`,
      `row-cols-md-${ this.colMd() }`,
      `row-cols-lg-${ this.colLg() }`,
      `row-cols-xl-${ this.colXl() }`,
    ].join(' ');
  });

  @HostBinding('class')
  get hostClasses() {
    return this.classList();
  }
}
