import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppNavbarComponent } from './navbar/navbar.component';

@Component({
    selector: 'app-home-header',
    templateUrl: './header.component.html',
    imports: [CommonModule, RouterModule, AppNavbarComponent],
})
export class HomeHeaderComponent {
    isScrolled = false;    

    @HostListener('window:scroll', [])
    onWindowScroll() {
        this.isScrolled = window.pageYOffset > 10;
    }
}