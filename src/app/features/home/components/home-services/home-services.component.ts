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
        { title: 'CUSTOMIZE WEBSITE DEVELOPMENT', id: 'web-dev', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600' },
        { title: 'PERFORMANCE & RESPONSIVENESS', id: 'performance', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' },
        { title: 'UI/UX WEBSITE DESIGN', id: 'ui-ux', img: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600' },
        { title: 'SOCIAL MEDIA DESIGN', id: 'social', img: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=600' },
        { title: 'SEO FRIENDLY', id: 'seo', img: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&q=80&w=600' },
        { title: 'AI INTEGRATION', id: 'ai', img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600' }
    ];

    skills = [
        { title: 'ANGULAR', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg' },
        { title: 'TYPESCRIPT', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
        { title: 'JAVASCRIPT', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
        { title: 'PYTHON', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
        { title: 'FASTAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg' },
        { title: 'GCP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg' },
        { title: 'AZURE', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg' },
        { title: 'MYSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
        { title: 'MONGODB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg' },
        { title: 'TENSORFLOW', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg' },
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
