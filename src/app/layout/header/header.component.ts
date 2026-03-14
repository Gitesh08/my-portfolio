import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule, ScrollAnimate],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
}
