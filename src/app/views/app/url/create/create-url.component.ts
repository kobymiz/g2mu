import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUrlFormComponent } from '../components/create-url-form.component';

@Component({
    selector: 'app-create-url',
    standalone: true,
    templateUrl: './create-url.component.html',    
    imports: [CommonModule, CreateUrlFormComponent],    
})
export class CreateUrlComponent {}