// widget.component.ts
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-widget',
  standalone: true,
  template: `
    <div class="card h-100">
      <div class="card-body">
        <h3 *ngIf="title().length>0">{{ title() }}</h3>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  imports: [CommonModule],
})
export class WidgetComponent {
  title = input<string>(''); // Title of the widget
}
