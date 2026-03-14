import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectModalComponent } from '../projects/components/project-modal/project-modal.component';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';

export interface CatalogItem {
    id: number;
    title: string;
    category: string;
    imageUrl: string;
    spanLevel: number; // 1 = normal, 2 = wide, 3 = tall, etc. setup for masonry grid
}

@Component({
    selector: 'app-catalogs',
    standalone: true,
    imports: [CommonModule, RouterModule, ScrollAnimate],
    templateUrl: './catalogs.component.html',
    styleUrls: ['./catalogs.component.css']
})
export class CatalogsComponent {
    categories = ['All', 'Websites', 'Logos', 'Social Media'];
    selectedCategory = signal<string>('All');
    
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
            spanLevel: 2 // Wide
        },
        {
            id: 3,
            title: 'Fitness App UI',
            category: 'Websites',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
            spanLevel: 3 // Tall
        },
        {
            id: 4,
            title: 'Energy Drink Campaign',
            category: 'Social Media',
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
            spanLevel: 1
        },
        {
            id: 5,
            title: 'Minimalist Studio Logo',
            category: 'Logos',
            imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1000',
            spanLevel: 1
        },
        {
            id: 6,
            title: 'SaaS Dashboard',
            category: 'Websites',
            imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
            spanLevel: 2 // Wide
        }
    ];

    // Computed property (essentially) using a getter for the view
    get filteredCatalogs() {
        if (this.selectedCategory() === 'All') {
            return this.catalogs;
        }
        return this.catalogs.filter(c => c.category === this.selectedCategory());
    }

    setCategory(cat: string) {
        this.selectedCategory.set(cat);
    }

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
        const currentLength = this.filteredCatalogs.length;
        this.activeImageIndex.update(i => (i + 1) % currentLength);
    }

    prevImage(event?: Event) {
        if (event) event.stopPropagation();
        const currentLength = this.filteredCatalogs.length;
        this.activeImageIndex.update(i => (i === 0) ? currentLength - 1 : i - 1);
    }
}
