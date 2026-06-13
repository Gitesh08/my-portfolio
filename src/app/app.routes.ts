import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        title: 'Gitesh Mahadik — Freelance Full-Stack Developer, Designer & Automation Expert',
        data: {
            description: 'Gitesh Mahadik is an elite freelance full-stack web developer and UI/UX designer. Whether you need a stunning business website, an AI chatbot to automate operations, or advanced Angular/React enterprise apps, get end-to-end solutions here.'
        },
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'projects',
        title: 'Projects | Gitesh Mahadik — Portfolio',
        data: {
            description: 'Explore the complete portfolio of projects by Gitesh Mahadik. Discover cutting-edge full-stack web applications, AI-powered tools, UI/UX designs, and open-source contributions.'
        },
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
    },
    {
        path: 'blogs',
        title: 'Blogs & Insights | Gitesh Mahadik',
        data: {
            description: 'Read the latest blogs and technical insights by Gitesh Mahadik on web development, AI integration, Angular, React, and software engineering best practices.'
        },
        loadComponent: () => import('./features/blogs/blogs').then(m => m.BlogsComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
