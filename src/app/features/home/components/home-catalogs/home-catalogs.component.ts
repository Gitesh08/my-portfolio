import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogItem } from '../../../catalogs/catalogs.component';
import { ScrollAnimate } from '../../../../shared/directives/scroll-animate';

@Component({
    selector: 'app-home-catalogs',
    standalone: true,
    imports: [CommonModule, RouterModule, ScrollAnimate],
    templateUrl: './home-catalogs.component.html',
    styleUrls: ['./home-catalogs.component.css']
})
export class HomeCatalogsComponent {
    
    // Lightbox State
    lightboxOpen = signal<boolean>(false);
    activeImageIndex = signal<number>(0);

    catalogs: CatalogItem[] = [
        {
            id: 1,
            title: 'E-commerce Landing Page',
            category: 'Websites',
            imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=1000',
            spanLevel: 1
        },
        {
            id: 2,
            title: 'Modern Tech Branding',
            category: 'Logos',
            imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1000',
            spanLevel: 2 
        },
        {
            id: 3,
            title: 'Fitness App UI',
            category: 'Websites',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
            spanLevel: 3 
        },
        {
            id: 4,
            title: 'Energy Drink Campaign',
            category: 'Social Media',
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
            spanLevel: 1
        }
    ];

    // Lightbox Methods
    openLightbox(index: number) {
        this.activeImageIndex.set(index);
        this.lightboxOpen.set(true);
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightboxOpen.set(false);
        document.body.style.overflow = '';
    }

    nextImage(event?: Event) {
        if (event) event.stopPropagation();
        const currentLength = this.catalogs.length;
        this.activeImageIndex.update(i => (i + 1) % currentLength);
    }

    prevImage(event?: Event) {
        if (event) event.stopPropagation();
        const currentLength = this.catalogs.length;
        this.activeImageIndex.update(i => (i === 0) ? currentLength - 1 : i - 1);
    }
}
