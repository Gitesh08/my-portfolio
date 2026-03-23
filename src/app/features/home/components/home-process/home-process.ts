import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home-process',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home-process.html',
    styleUrl: './home-process.css'
})
export class HomeProcess implements AfterViewInit {
    @ViewChild('stickyTrack') stickyTrack!: ElementRef;
    @ViewChild('scrollSection') scrollSection!: ElementRef;

    translateX = 0;
    progressPercentage = 0;

    steps = [
        { title: 'Discovery & Strategy', desc: 'Understanding goals, target audience, and project constraints. We start with a solid foundation to ensure the project aligns perfectly with vision.' },
        { title: 'Design & Prototyping', desc: 'Creating wireframes and high-fidelity mockups. I craft intuitive user interfaces that are not just beautiful, but highly user-centric.' },
        { title: 'Development', desc: 'Bringing the designs to life with clean, scalable, and responsive code. Building robust architectures tailored for long-term growth.' },
        { title: 'Launch & SEO', desc: 'Deploying the application, optimizing performance, and ensuring the website ranks well on search engines to reach audience effectively.' }
    ];

    ngAfterViewInit() {
        this.onScroll();
    }

    @HostListener('window:scroll')
    onScroll() {
        if (!this.scrollSection || !this.stickyTrack) return;

        const section = this.scrollSection.nativeElement;
        const rect = section.getBoundingClientRect();

        const stickyContainer = this.stickyTrack.nativeElement.closest('.sticky-container');
        const containerHeight = stickyContainer ? stickyContainer.offsetHeight : window.innerHeight;

        const maxScroll = section.offsetHeight - containerHeight;

        let progress = -rect.top / maxScroll;
        progress = Math.max(0, Math.min(1, progress));

        this.progressPercentage = progress * 100;

        const trackWidth = this.stickyTrack.nativeElement.scrollWidth;
        const wrapper = this.stickyTrack.nativeElement.parentElement;
        const wrapperLeft = wrapper ? wrapper.getBoundingClientRect().left : 0;

        // Add padding to ensure the last card fully sweeps onto the screen
        const paddingRight = 40;
        const maxTranslate = Math.max(0, wrapperLeft + trackWidth - window.innerWidth + paddingRight);

        this.translateX = -(progress * maxTranslate);
    }
}
