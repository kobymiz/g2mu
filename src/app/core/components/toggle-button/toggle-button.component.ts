import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  effect,
  OnInit,
  input
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToggleButtonMode = { key: string; label: string; isdefault?: boolean };
export type ToggleButtonModes = { first: ToggleButtonMode; second: ToggleButtonMode };

const DEFAULT_MODES: ToggleButtonModes = {
  first: { key: 'default', label: 'Default', isdefault: true },
  second: { key: 'alternate', label: 'Alternate' }
};

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-button.component.html',
})
export class ToggleButtonComponent {
  modes = input<ToggleButtonModes>(DEFAULT_MODES);

  // Two-way bindable input/output
  mode = input<string>('');  
  size = input<string>('sm'); // Default size can be 'sm', 'md', 'lg'
  
  /** Event for legacy binding (optional) */
  @Output() toggle = new EventEmitter<string>();

  /** Internal signal-based state for animations/UI */
  protected internalMode = signal<string>('');

  constructor(){
    // Initialize the internal signal from input
    this.internalMode.set(
      this.mode() ??
        (this.modes().second.isdefault ? this.modes().second.key : this.modes().first.key)
    );

    // Sync external input to internal signal (if parent changes @Input())
    effect(() => {        
      if (this.mode() !== this.internalMode()) {
        this.internalMode.set(this.mode() ?? this.internalMode());
      }
    });
  }

  toggleMode() {
    const next =
      this.internalMode() === this.modes().first.key
        ? this.modes().second.key
        : this.modes().first.key;
    this.setMode(next);
  }

  setMode(mode: string) {
    this.internalMode.set(mode);    
    this.toggle.emit(mode);
  }
}