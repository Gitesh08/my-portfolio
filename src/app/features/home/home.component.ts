import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { HomeStatementComponent } from './components/home-statement/home-statement.component';
import { HomeServicesComponent } from './components/home-services/home-services.component';
import { HomeProjectsComponent } from './components/home-projects/home-projects.component';
import { HomeBlogsComponent } from './components/home-blogs/home-blogs.component';
import { HomeProcess } from './components/home-process/home-process';
import { HomeContact } from './components/home-contact/home-contact';

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
export class HomeComponent {
}
