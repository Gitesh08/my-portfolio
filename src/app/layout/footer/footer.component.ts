import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, ScrollAnimate],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
}
