import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './project-modal.component.html',
    styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent implements OnChanges {
    @Input() project: any = null;
    @Input() isOpen: boolean = false;
    @Output() close = new EventEmitter<void>();

    currentImageIndex: number = 0;

    // Gallery lightbox state
    isGalleryOpen: boolean = false;
    galleryIndex: number = 0;
    galleryImages: string[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
            this.currentImageIndex = 0;
            this.isGalleryOpen = false;
        }
    }

    closeModal() {
        this.close.emit();
    }

    openLink(url: string) {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    prevImage(event: Event) {
        event.stopPropagation();
        if (!this.project?.images?.length) return;
        this.currentImageIndex = (this.currentImageIndex > 0) ? this.currentImageIndex - 1 : this.project.images.length - 1;
    }

    nextImage(event: Event) {
        event.stopPropagation();
        if (!this.project?.images?.length) return;
        this.currentImageIndex = (this.currentImageIndex < this.project.images.length - 1) ? this.currentImageIndex + 1 : 0;
    }

    setCurrentImage(index: number, event: Event) {
        event.stopPropagation();
        this.currentImageIndex = index;
    }

    // ---- Gallery lightbox ----
    openGallery(event: Event) {
        event.stopPropagation();
        const images = this.project?.images;
        if (images?.length) {
            this.galleryImages = images;
            this.galleryIndex = this.currentImageIndex;
        } else if (this.project?.imageUrl) {
            this.galleryImages = [this.project.imageUrl];
            this.galleryIndex = 0;
        } else {
            return;
        }
        this.isGalleryOpen = true;
        document.body.style.overflow = 'hidden';
    }

    closeGallery() {
        this.isGalleryOpen = false;
        document.body.style.overflow = 'hidden'; // keep modal scroll locked
    }

    galleryPrev(event: Event) {
        event.stopPropagation();
        this.galleryIndex = (this.galleryIndex > 0) ? this.galleryIndex - 1 : this.galleryImages.length - 1;
    }

    galleryNext(event: Event) {
        event.stopPropagation();
        this.galleryIndex = (this.galleryIndex < this.galleryImages.length - 1) ? this.galleryIndex + 1 : 0;
    }

    setGalleryIndex(index: number) {
        this.galleryIndex = index;
    }
}
