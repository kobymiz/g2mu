// widget-container.component.ts
import { Component, computed, input, HostBinding, Host } from '@angular/core';
import { GridContainerComponent } from './grid-container.component';

@Component({
  selector: 'app-widget-container',
  standalone: true,
  template: `<ng-content></ng-content>`
})
export class WidgetContainerComponent {
  constructor(@Host() private grid: GridContainerComponent) {}

  /** how many grid-columns to span (1,2,3,4,6,8,12) */
  readonly cols   = input.required<number>();              // [cols]="2"
  /** optional overrides per breakpoint */
  readonly colsXs = input<number|undefined>(undefined, { alias: 'cols-xs' });
  readonly colsSm = input<number|undefined>(undefined, { alias: 'cols-sm' });
  readonly colsMd = input<number|undefined>(undefined, { alias: 'cols-md' });
  readonly colsLg = input<number|undefined>(undefined, { alias: 'cols-lg' });
  readonly colsXl = input<number|undefined>(undefined, { alias: 'cols-xl' });

  /** fall-back chain for widget-span */
  readonly spanXs = computed(() => this.colsXs() ?? this.cols());
  readonly spanSm = computed(() => this.colsSm() ?? this.spanXs());
  readonly spanMd = computed(() => this.colsMd() ?? this.spanSm());
  readonly spanLg = computed(() => this.colsLg() ?? this.spanMd());
  readonly spanXl = computed(() => this.colsXl() ?? this.spanLg());

  /** convert to Bootstrap’s 12-unit grid */
  private toUnits(widgetCols: number, gridCols: number) {
    const units = (12 / gridCols) * widgetCols;
    if (!Number.isInteger(units)) {
      console.warn(
        `⚠️ widget span ${widgetCols}/grid ${gridCols} → non-integer cols: ${units.toFixed(2)}`
      );
    }
    return Math.round(units);
  }

  readonly unitXs = computed(() =>
    this.toUnits(this.spanXs(), this.grid.colXs())
  );
  readonly unitSm = computed(() =>
    this.toUnits(this.spanSm(), this.grid.colSm())
  );
  readonly unitMd = computed(() =>
    this.toUnits(this.spanMd(), this.grid.colMd())
  );
  readonly unitLg = computed(() =>
    this.toUnits(this.spanLg(), this.grid.colLg())
  );
  readonly unitXl = computed(() =>
    this.toUnits(this.spanXl(), this.grid.colXl())
  );

  /** final class list: col-*, col-sm-*, etc. */
  readonly classList = computed(() => [
    `col-${  this.unitXs() }`,
    `col-sm-${ this.unitSm() }`,
    `col-md-${ this.unitMd() }`,
    `col-lg-${ this.unitLg() }`,
    `col-xl-${ this.unitXl() }`,
  ].join(' '));

  @HostBinding('class')
  get hostClasses() {
    return this.classList();
  }
}
