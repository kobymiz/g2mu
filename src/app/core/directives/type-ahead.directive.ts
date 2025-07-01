// src/app/directives/typeahead.directive.ts
import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  takeUntil
} from 'rxjs/operators';

@Directive({
  selector: '[appTypeahead]',
  standalone: true
})
export class TypeaheadDirective implements OnInit, OnDestroy {
  /** Minimum length before triggering */
  @Input() minLength = 1;
  /** Debounce time in ms */
  @Input() debounceTime = 300;
  /** Function to call for each value, should return Observable<boolean> or {available:boolean} */
  @Input() typeaheadFn!: (value: string) => Observable<any>;

  /** Error key to set on control when unavailable */
  @Input() errorKey = 'notAvailable';

  private destroy$ = new Subject<void>();

  constructor(private controlDir: NgControl) {}

  ngOnInit() {
    const control = this.controlDir.control;
    if (!control || !this.controlDir.valueChanges) {
      console.warn('TypeaheadDirective: No form control found');
      return;
    }

    this.controlDir.valueChanges
      .pipe(
        filter((val: any) => typeof val === 'string'),
        filter((val: string) => val.length >= this.minLength),
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        switchMap((val: string) =>
          this.typeaheadFn(val).pipe(
            catchError(() => of({ available: false }))
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => {
        const available =
          typeof res === 'boolean' ? res : res?.available;
        if (available) {
          control.setErrors(null);
        } else {
          control.setErrors({ [this.errorKey]: true });
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
