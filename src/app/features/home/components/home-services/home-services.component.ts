import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollAnimate } from '../../../../shared/directives/scroll-animate';

@Component({
    selector: 'app-home-services',
    standalone: true,
    imports: [CommonModule, RouterModule, ScrollAnimate],
    templateUrl: './home-services.component.html',
    styleUrls: ['./home-services.component.css']
})
export class HomeServicesComponent {
    services = [
        { title: 'WEBSITE DEVELOPMENT', id: 'web-dev', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=200' },
        { title: 'PERFORMANCE & RESPONSIVENESS', id: 'performance', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200' },
        { title: 'UI/UX WEBSITE DESIGN', id: 'ui-ux', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=200' },
        { title: 'SOCIAL MEDIA DESIGN', id: 'social', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200' },
        { title: 'LOGO DESIGN', id: 'logo', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=200' }
    ];

    skills = [
        { title: 'ANGULAR', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg' },
        { title: 'TYPESCRIPT', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
        { title: 'JAVASCRIPT', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
        { title: 'PYTHON', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
        { title: 'NODE.JS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg' },
        { title: 'EXPRESS.JS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', invertDark: true },
        { title: 'TAILWINDCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
        { title: 'BOOTSTRAP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg' },
        { title: 'DOCKER', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
        { title: 'PHOTOSHOP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg' },
        { title: 'ILLUSTRATOR', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-line.svg', invertDark: true },
        { title: 'FIGMA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg' },
        { title: 'CANVA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg' }
    ];

    loadedImages = new Set<string>();

    onImageLoad(id: string) {
        this.loadedImages.add(id);
    }
}
