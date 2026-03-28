import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { HomeStatementComponent } from './components/home-statement/home-statement.component';
import { HomeServicesComponent } from './components/home-services/home-services.component';
import { HomeProjectsComponent } from './components/home-projects/home-projects.component';
import { HomeBlogsComponent } from './components/home-blogs/home-blogs.component';
import { HomeProcess } from './components/home-process/home-process';
import { HomeContact } from './components/home-contact/home-contact';
import { SeoService } from '../../shared/services/seo.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        HomeHeroComponent,
        HomeStatementComponent,
        HomeServicesComponent,
        HomeProjectsComponent,
        HomeBlogsComponent,
        HomeProcess,
        HomeContact
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    private seo = inject(SeoService);

    ngOnInit(): void {
        this.seo.updateMeta({
            title: 'Gitesh Mahadik — Full-Stack Web Developer & Designer',
            description: 'Hi, I\'m Gitesh Mahadik — a full-stack web developer and designer with 2+ years of experience. I build fast, beautiful, and AI-powered web apps. Explore my projects and skills.',
            keywords: 'Gitesh Mahadik, Gitesh portfolio, gitesh mahadik portfolio, full stack developer, web designer, Angular developer, gitesh developer',
            url: '/'
        });
    }
}
