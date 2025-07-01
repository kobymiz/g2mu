import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from '@coreui/angular';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [CommonModule, ModalModule],
  templateUrl: './alert-dialog.component.html'
})
export class AlertDialogComponent {
  title = input.required<string>();
  confirmText = input('Confirm');
  cancelText = input('Cancel');
  visible = input.required<boolean>();

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  public onConfirm(): void {
    console.log('Confirmed');
    this.confirm.emit();    
  }

  public onCancel(): void {
    console.log('Cancelled');
    this.cancel.emit();    
  }
}
