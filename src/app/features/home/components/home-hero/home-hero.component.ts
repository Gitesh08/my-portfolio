import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ScrollAnimate } from '../../../../shared/directives/scroll-animate';
import { Typewriter } from '../../../../shared/directives/typewriter';

@Component({
    selector: 'app-home-hero',
    standalone: true,
    imports: [CommonModule, ScrollAnimate, Typewriter, NgOptimizedImage],
    templateUrl: './home-hero.component.html',
    styleUrls: ['./home-hero.component.css']
})
export class HomeHeroComponent {
    // We can add signal or RxJS logic here later if needed for scroll animations
}
